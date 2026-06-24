"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatTime } from "@/lib/utils/time";
import type { MonitoringLog } from "@/types";

interface ResponseTimeChartProps {
  logs: MonitoringLog[];
  status: string;
}

interface ChartDataPoint {
  time: string;
  responseTime: number | null;
  fullTime: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
}) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="rounded-md border border-zinc-800 bg-[#18181b] px-3 py-2">
      <p className="text-xs text-zinc-400">{data.fullTime}</p>
      <p
        className="text-sm font-medium text-white"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {data.responseTime != null ? `${data.responseTime}ms` : "—"}
      </p>
    </div>
  );
}

export function ResponseTimeChart({ logs, status }: ResponseTimeChartProps) {
  const color = status === "DOWN" ? "#ef4444" : "#22c55e";

  // Reverse so oldest is first (left side of chart)
  const chartData: ChartDataPoint[] = [...logs].reverse().map((log) => ({
    time: formatTime(log.checked_at),
    responseTime: log.response_time,
    fullTime: log.checked_at,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-zinc-500">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 11 }}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 11 }}
          tickFormatter={(v) => `${v}ms`}
          width={50}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#27272a", strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey="responseTime"
          stroke={color}
          strokeWidth={1.5}
          fill="url(#responseGradient)"
          dot={false}
          activeDot={{ r: 3, fill: color, stroke: color }}
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
