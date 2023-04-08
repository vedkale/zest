"use client";

import { formatDollar } from "@/lib/utils";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";

export default function TimeChart({
    data,
    prevData,
    currentMonth,
    prevMonth,
}: {
    data: {
        date: string;
        amount: number;
    }[];
    prevData: {
        date: string;
        amount: number;
    }[];
    currentMonth: string;
    prevMonth: string;
}) {
    const a = data.map((d) => {
        return {
            date: d.date,
            amount: d.amount,
        };
    });
    const chartData = [
        {
            name: currentMonth,
            data: data.map((d) => {
                return {
                    date: new Date(d.date).getUTCDate(),
                    amount: d.amount,
                };
            }),
        },
        {
            name: prevMonth,
            data: prevData.map((d) => {
                return {
                    date: new Date(d.date).getUTCDate(),
                    amount: d.amount - Math.random() * 200,
                };
            }),
        },
    ];

    return (
        <>
            <ResponsiveContainer aspect={2}>
                <LineChart
                    // width={500}
                    // height={300}
                    data={chartData}
                    margin={{ top: 20 }}
                    desc="HEHEHEH"
                >
                    <Label value="P"></Label>
                    <XAxis
                        domain={["auto", "auto"]}
                        type="number"
                        dataKey="date"
                        tick={false}
                    />
                    <YAxis />
                    <Legend />
                    {chartData.map((s) => (
                        <Line
                            dataKey="amount"
                            data={s.data}
                            name={s.name}
                            key={s.name}
                            dot={false}
                            strokeWidth={s.name === currentMonth ? 3 : 1}
                            opacity={s.name === currentMonth ? 1 : 0.5}
                            stroke={
                                s.name === currentMonth ? "#8884d8" : "#82ca9d"
                            }
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}
