import { useRef } from "react";

// Placement of text labels on recharts points so they don't collide.
//
// recharts renders a LabelList's labels in data order, and one Line's labels
// before the next Line's. So when a label is placed, every label before it
// (by series, then index) has already been placed in the same pass, and it can
// step away from its point until it is clear of them. Placements are kept by
// position rather than rebuilt per render, because recharts re-renders labels
// (on hover, resize) without re-rendering the chart component.

const FONT_SIZE = 11;
const FONT = `bold ${FONT_SIZE}px sans-serif`;
const GAP = 12; // distance from the point to the first row of labels
const ROW_HEIGHT = 14;
const MAX_ROWS = 3;
const HORIZONTAL_PADDING = 4;

// Room a chart should leave beyond its extreme points for stacked labels.
export const LABEL_ROOM = GAP + ROW_HEIGHT * MAX_ROWS;

let measureContext: CanvasRenderingContext2D | null = null;
const measure = (text: string) => {
  measureContext ??= document.createElement("canvas").getContext("2d");
  if (!measureContext) return text.length * 7;
  measureContext.font = FONT;
  return measureContext.measureText(text).width;
};

interface Box {
  left: number;
  right: number;
  centre: number; // vertical centre of the text
}

export interface LabelPlacement {
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
}

export interface LabelRequest {
  series?: number; // which Line the label belongs to, in render order
  index: number;
  count: number; // points in the series, to keep the end labels inside the plot
  x: number;
  y: number;
  text: string;
  // "up"/"down": centred over or under the point, stepping further out.
  // "right": just right of the point, stepping alternately above and below.
  direction: "up" | "down" | "right";
}

export function useLabelPlacer() {
  const placed = useRef(new Map<number, Box>());
  const order = (series: number, index: number) => series * 1_000_000 + index;

  // Finds the first row clear of every earlier label, or returns null if
  // there is none within MAX_ROWS; a hidden label beats an unreadable one.
  const place = ({
    series = 0,
    index,
    count,
    x,
    y,
    text,
    direction,
  }: LabelRequest): LabelPlacement | null => {
    const key = order(series, index);
    const width = measure(text);
    const beside = direction === "right";
    const anchor = beside
      ? "start"
      : index === 0
        ? "start"
        : index === count - 1
          ? "end"
          : "middle";
    const labelX = beside ? x + 6 : x;
    const left =
      anchor === "start"
        ? labelX
        : anchor === "end"
          ? labelX - width
          : labelX - width / 2;
    const right = left + width;

    const earlier = [...placed.current]
      .filter(([other]) => other < key)
      .map(([, box]) => box);
    const sign = direction === "up" ? -1 : 1;
    // Beside the point: level with it, then one row above, one below, two
    // above... Over or under it: GAP away, then a row further each time.
    const centres = beside
      ? Array.from(
          { length: MAX_ROWS * 2 - 1 },
          (_, i) => y + (i % 2 ? -1 : 1) * Math.ceil(i / 2) * ROW_HEIGHT,
        )
      : Array.from(
          { length: MAX_ROWS },
          (_, row) => y + sign * (GAP + row * ROW_HEIGHT),
        );

    for (const centre of centres) {
      const collides = earlier.some(
        (box) =>
          Math.abs(box.centre - centre) < ROW_HEIGHT &&
          left < box.right + HORIZONTAL_PADDING &&
          right > box.left - HORIZONTAL_PADDING,
      );
      if (!collides) {
        placed.current.set(key, { left, right, centre });
        return { x: labelX, y: centre, anchor };
      }
    }

    placed.current.delete(key);
    return null;
  };

  // For points that have no label, so a stale placement from an earlier
  // render (different data, different size) doesn't block later labels.
  const skip = (series: number, index: number) =>
    placed.current.delete(order(series, index));

  return { place, skip };
}

export function ChartLabel({
  placement,
  fill,
  children,
}: {
  placement: LabelPlacement;
  fill: string;
  children: string;
}) {
  return (
    <text
      x={placement.x}
      y={placement.y}
      fontSize={FONT_SIZE}
      fill={fill}
      // A halo in the card colour keeps the text readable where it crosses
      // the line.
      stroke="var(--card)"
      strokeWidth={3}
      paintOrder="stroke"
      fontWeight="bold"
      textAnchor={placement.anchor}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
}
