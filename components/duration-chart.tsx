"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";
import { Icebath } from "@/types/icebath";
import { Clock } from "lucide-react";

interface DurationChartProps {
  icebaths: Icebath[];
}

export function DurationChart({ icebaths }: DurationChartProps) {
  if (icebaths.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Dauer Verlauf
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground">
          Keine Daten verfügbar
        </CardContent>
      </Card>
    );
  }

  // Sortiere chronologisch (älteste zuerst) für den Chart
  const chartData = icebaths
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((ib) => ({
      date: format(new Date(ib.date), "dd.MM"),
      duration: ib.duration,
      fullDate: format(new Date(ib.date), "EEEE, dd.MM.yyyy", { locale: de }),
      time: format(new Date(ib.date), "HH:mm"),
    }));

  const minDuration = Math.min(...chartData.map((d) => d.duration));
  const maxDuration = Math.max(...chartData.map((d) => d.duration));
  const avgDuration = chartData.reduce((sum, d) => sum + d.duration, 0) / chartData.length;
  const durationRange = maxDuration - minDuration;
  const yAxisDomain = [
    Math.max(0, Math.floor(minDuration - durationRange * 0.15)),
    Math.ceil(maxDuration + durationRange * 0.15),
  ];

  const formatDurationTooltip = (value: number) => {
    const mins = Math.floor(value / 60);
    const secs = value % 60;
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm mb-1">{data.fullDate}</p>
          <p className="text-xs text-muted-foreground mb-2">{data.time} Uhr</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <span className="text-lg font-bold text-purple-600">
              {formatDurationTooltip(payload[0].value)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Dauer Verlauf
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart 
            data={chartData} 
            margin={{ top: 10, right: 15, left: 0, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorDurationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--muted-foreground))" 
              opacity={0.2}
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              domain={yAxisDomain}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              label={{ value: "Sekunden", angle: -90, position: "insideLeft", style: { fill: "hsl(var(--foreground))" } }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={avgDuration} 
              stroke="#8b5cf6" 
              strokeDasharray="5 5" 
              label={{ value: `Ø ${formatDurationTooltip(avgDuration)}`, position: "right", fill: "#8b5cf6" }}
            />
            <Area
              type="monotone"
              dataKey="duration"
              stroke="url(#colorDurationGradient)"
              strokeWidth={3}
              fill="url(#colorDurationGradient)"
              dot={{ r: 4, fill: "#a855f7", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#a855f7", strokeWidth: 2, stroke: "#fff" }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

