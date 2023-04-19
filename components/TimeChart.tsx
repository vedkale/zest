'use client';

import { formatDollar } from '@/lib/utils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
    Label,
    CartesianGrid,
    AreaChart,
    Area,
} from 'recharts';

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
                <AreaChart
                    // width={500}
                    // height={300}
                    data={chartData}
                    margin={{ top: 20 }}
                >
                    <defs>
                        <linearGradient
                            id={currentMonth}
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                        >
                            <stop
                                offset='5%'
                                stopColor='#8884d8'
                                stopOpacity={0.4}
                            />
                            <stop
                                offset='95%'
                                stopColor='#8884d8'
                                stopOpacity={0}
                            />
                        </linearGradient>
                        <linearGradient
                            id={prevMonth}
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                        >
                            <stop
                                offset='5%'
                                stopColor='#82ca9d'
                                stopOpacity={0.8}
                            />
                            <stop
                                offset='95%'
                                stopColor='#82ca9d'
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis
                        domain={['auto', 'auto']}
                        type='number'
                        dataKey='date'
                        tick={false}
                        axisLine={false}
                    />
                    <YAxis
                        tickFormatter={(value: number, index: number) =>
                            formatDollar(value)
                        }
                        tickLine={false}
                        axisLine={false}
                    />
                    <Legend />
                    <CartesianGrid
                        strokeDasharray='5 5'
                        strokeOpacity={0.2}
                        horizontal={true}
                        vertical={false}
                    />
                    {chartData.map((s) => (
                        <Area
                            type='linear'
                            dataKey='amount'
                            data={s.data}
                            name={s.name}
                            key={s.name}
                            fillOpacity={1}
                            // strokeWidth={2}
                            // fill="url(#colorUv)"
                            fill={
                                s.name === currentMonth
                                    ? `url(#${currentMonth})`
                                    : `url(#${prevMonth})`
                            }
                            strokeWidth={s.name === currentMonth ? 2 : 1}
                            opacity={s.name === currentMonth ? 1 : 0.7}
                            stroke={
                                s.name === currentMonth ? '#8884d8' : '#82ca9d'
                            }
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
}
