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
                top: 30,
                bottom: 30,
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
                    const previous =
                      index > 0 ? data[index - 1][record] : undefined;
                    if (previous === value) return null;

                    return (
                      <text
                        x={Number(x)}
                        y={Number(y) + (isWin ? -12 : 14)}
                        fontSize={11}
                        fill={color}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {data[index].player} {formatAmount(value, currency)}
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
