import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
} from "recharts";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RecordChartPoint, RecordKey, recordDetails } from "../types";

const formatAmount = (value: number, currency: string) =>
  `${value < 0 ? "-" : "+"}${currency}${Math.abs(value).toFixed(2)}`;

const LABEL_FONT = "bold 11px sans-serif";
const LABEL_GAP = 12; // distance from the point to the first row of labels
const ROW_HEIGHT = 14;
const MAX_ROWS = 3;
const LABEL_ROOM = LABEL_GAP + ROW_HEIGHT * MAX_ROWS;

let measureContext: CanvasRenderingContext2D | null = null;
const measureLabel = (text: string) => {
  measureContext ??= document.createElement("canvas").getContext("2d");
  if (!measureContext) return text.length * 7;
  measureContext.font = LABEL_FONT;
  return measureContext.measureText(text).width;
};

interface PlacedLabel {
  left: number;
  right: number;
  centre: number; // vertical centre of the text
}

// How one of the club's single-session records moved over time. Each step is
// a game where the record was broken, labelled with who broke it.
export function Chart({
  data,
  record,
  currency,
}: {
  data: RecordChartPoint[];
  record: RecordKey;
  currency: string;
}) {
  const { label, color } = recordDetails[record];
  const chartConfig = { [record]: { label, color } } satisfies ChartConfig;
  const isWin = record === "biggest_win";

  // Where each label ended up, by data index. Labels render in index order, so
  // when label i is placed every earlier label has already been placed in the
  // same pass, and it can step away from the point until it is clear of them.
  const placedLabels = useRef<Map<number, PlacedLabel>>(new Map());

  const maxAbsValue = Math.max(
    0,
    ...data.map((point) => Math.abs(point[record] ?? 0)),
  );

  return (
    <Card className="my-4">
      <CardContent className="pl-0 pr-1 sm:px-6 h-[450px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                top: 12,
                bottom: 12,
                left: 12,
                right: 60,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                domain={isWin ? [0, maxAbsValue] : [-maxAbsValue, 0]}
                tickFormatter={(value) => value.toFixed(2)}
                // Room for the stacked labels on the side they grow towards,
                // so they stay clear of the axis and its dates.
                padding={
                  isWin ? { top: LABEL_ROOM } : { bottom: LABEL_ROOM }
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <div className="flex w-full items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-muted-foreground">
                          {item.payload.player}
                        </span>
                        <span className="ml-auto font-mono font-medium tabular-nums">
                          {formatAmount(Number(value), currency)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Line
                connectNulls
                dataKey={record}
                type="step"
                stroke={color}
                strokeWidth={2}
              >
                {/* Label each point where the record was broken */}
                <LabelList
                  dataKey={record}
                  content={({ x, y, index }) => {
                    if (index === undefined) return null;
                    const value = data[index][record];
                    if (value === undefined) return null;
                    // Label where the record changed hands or amount.
                    const previous = index > 0 ? data[index - 1] : undefined;
                    if (
                      previous?.[record] === value &&
                      previous?.player === data[index].player
                    )
                      return null;

                    const text = `${data[index].player} ${formatAmount(value, currency)}`;
                    const width = measureLabel(text);

                    // Keep the first and last labels inside the plot instead
                    // of centring them over the axis or past the right edge.
                    const anchor =
                      index === 0
                        ? "start"
                        : index === data.length - 1
                          ? "end"
                          : "middle";
                    const left =
                      anchor === "start"
                        ? Number(x)
                        : anchor === "end"
                          ? Number(x) - width
                          : Number(x) - width / 2;
                    const right = left + width;

                    const earlier = [...placedLabels.current]
                      .filter(([i]) => i < index)
                      .map(([, label]) => label);
                    const direction = isWin ? -1 : 1;
                    const centreForRow = (row: number) =>
                      Number(y) + direction * (LABEL_GAP + row * ROW_HEIGHT);
                    const collides = (centre: number) =>
                      earlier.some(
                        (label) =>
                          Math.abs(label.centre - centre) < ROW_HEIGHT &&
                          left < label.right + 4 &&
                          right > label.left - 4,
                      );

                    let row = 0;
                    while (row < MAX_ROWS - 1 && collides(centreForRow(row))) {
                      row += 1;
                    }
                    const centre = centreForRow(row);
                    placedLabels.current.set(index, { left, right, centre });

                    return (
                      <text
                        x={Number(x)}
                        y={centre}
                        fontSize={11}
                        fill={color}
                        // A halo in the card colour keeps the text readable
                        // where it crosses the line.
                        stroke="var(--card)"
                        strokeWidth={3}
                        paintOrder="stroke"
                        fontWeight="bold"
                        textAnchor={anchor}
                        dominantBaseline="middle"
                      >
                        {text}
                      </text>
                    );
                  }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
