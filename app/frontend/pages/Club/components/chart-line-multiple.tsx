import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, Legend, YAxis } from "recharts";

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
  return (
    <Card className="my-4">
      {/*<CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>*/}
      <CardContent className="pl-0 pr-1 sm:px-6">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {players.map((player, index) => (
              <Line
                connectNulls
                dataKey={player.name}
                type="monotone"
                stroke={colors[index]}
                strokeWidth={2}
              />
            ))}
            <Legend />
          </LineChart>
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
