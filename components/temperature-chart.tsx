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
import { Thermometer } from "lucide-react";

interface TemperatureChartProps {
  icebaths: Icebath[];
}

export function TemperatureChart({ icebaths }: TemperatureChartProps) {
  if (icebaths.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-blue-600" />
            Temperatur Verlauf
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
      temperature: Math.round(ib.temperature * 10) / 10,
      fullDate: format(new Date(ib.date), "EEEE, dd.MM.yyyy", { locale: de }),
      time: format(new Date(ib.date), "HH:mm"),
    }));

  const minTemp = Math.min(...chartData.map((d) => d.temperature));
  const maxTemp = Math.max(...chartData.map((d) => d.temperature));
  const avgTemp = chartData.reduce((sum, d) => sum + d.temperature, 0) / chartData.length;
  const tempRange = maxTemp - minTemp;
  const yAxisDomain = [
    Math.max(0, Math.floor(minTemp - tempRange * 0.15)),
    Math.ceil(maxTemp + tempRange * 0.15),
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm mb-1">{data.fullDate}</p>
          <p className="text-xs text-muted-foreground mb-2">{data.time} Uhr</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <span className="text-lg font-bold text-blue-600">
              {payload[0].value}°C
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/10 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Temperatur Verlauf
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart 
            data={chartData} 
            margin={{ top: 10, right: 15, left: 0, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
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
              label={{ value: "°C", angle: -90, position: "insideLeft", style: { fill: "hsl(var(--foreground))" } }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={avgTemp} 
              stroke="#8b5cf6" 
              strokeDasharray="5 5" 
              label={{ value: `Ø ${avgTemp.toFixed(1)}°C`, position: "right", fill: "#8b5cf6" }}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="url(#colorTemperature)"
              strokeWidth={3}
              fill="url(#colorTemperature)"
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

