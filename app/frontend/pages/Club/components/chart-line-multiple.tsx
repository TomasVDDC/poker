import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Legend,
  YAxis,
  ReferenceLine,
  LabelList,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PlayerType } from "@/pages/Player/types";
import { ChartLabel, useLabelPlacer } from "@/lib/chart-labels";

// https://www.heavy.ai/blog/12-color-palettes-for-telling-better-stories-with-your-data
// combination of retro metro and river nights color palettes
const colors = [
  "#ea5545",
  "#f46a9b",
  "#ef9b20",
  "#edbf33",
  "#ede15b",
  "#bdcf32",
  "#87bc45",
  "#27aeef",
  "#b33dc6",
  "#b30000",
  "#7c1158",
  "#4421af",
  "#1a53ff",
  "#0d88e6",
  "#00b7c7",
  "#5ad45a",
  "#8be04e",
  "#ebdc78",
];
// const chartData = [
//   { month: "January", desktop: "186", mobile: "80" },
//   { month: "February", desktop: 305, mobile: 80 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {} satisfies ChartConfig;

export function ChartLineMultiple({
  data,
  players,
}: {
  data: any;
  players: PlayerType[];
}) {
  const labels = useLabelPlacer();

  return (
    <Card className="my-4">
      {/*<CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>*/}
      <CardContent className="pl-0 pr-1 sm:px-6 h-[450px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                top: 12,
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
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ReferenceLine
                y={0}
                stroke="red"
                strokeWidth={2}
                strokeDasharray="3 3"
              />
              {players.map((player, player_index) => (
                <Line
                  connectNulls
                  dataKey={player.name}
                  type="step"
                  stroke={colors[player_index]}
                  strokeWidth={2}
                >
                  <LabelList
                    dataKey={player.name}
                    position="right"
                    content={({ x, y, index }) => {
                      if (index === undefined) return null;
                      // Name each line at its last point, stepping above or
                      // below to clear players who finished close by.
                      if (
                        index !== data.length - 1 ||
                        !(player.name in data[index])
                      ) {
                        labels.skip(player_index, index);
                        return null;
                      }
                      const placement = labels.place({
                        series: player_index,
                        index,
                        count: data.length,
                        x: Number(x),
                        y: Number(y),
                        text: player.name,
                        direction: "right",
                      });
                      return (
                        placement && (
                          <ChartLabel
                            placement={placement}
                            fill={colors[player_index]}
                          >
                            {player.name}
                          </ChartLabel>
                        )
                      );
                    }}
                  />
                </Line>
              ))}
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {/*<CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>*/}
    </Card>
  );
}
