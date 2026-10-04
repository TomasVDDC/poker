import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartLabel, LABEL_ROOM, useLabelPlacer } from "@/lib/chart-labels";
import { RecordChartPoint, RecordKey, recordDetails } from "../types";

const formatAmount = (value: number, currency: string) =>
  `${value < 0 ? "-" : "+"}${currency}${Math.abs(value).toFixed(2)}`;

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

  const labels = useLabelPlacer();

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
                    // Label where the record changed hands or amount.
                    const previous = index > 0 ? data[index - 1] : undefined;
                    if (
                      value === undefined ||
                      (previous?.[record] === value &&
                        previous?.player === data[index].player)
                    ) {
                      labels.skip(0, index);
                      return null;
                    }

                    const text = `${data[index].player} ${formatAmount(value, currency)}`;
                    const placement = labels.place({
                      index,
                      count: data.length,
                      x: Number(x),
                      y: Number(y),
                      text,
                      direction: isWin ? "up" : "down",
                    });
                    return (
                      placement && (
                        <ChartLabel placement={placement} fill={color}>
                          {text}
                        </ChartLabel>
                      )
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
