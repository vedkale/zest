'use client';

import { formatDollar } from '@/lib/utils';
import {
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    AreaChart,
    Area,
} from 'recharts';

export default function SpendingAreaChart({
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
    const chartData = [
        {
            name: prevMonth,
            data: prevData.map((d) => {
                return {
                    date: new Date(d.date).getUTCDate(),
                    amount: d.amount - Math.random() * 1000, //TODO: Change later
                };
            }),
        },
        {
            name: currentMonth,
            data: data.map((d) => {
                return {
                    date: new Date(d.date).getUTCDate(),
                    amount: d.amount,
                };
            }),
        },
    ];

    return (
        <>
            <ResponsiveContainer aspect={2}>
                <AreaChart data={chartData} margin={{ top: 20 }}>
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
                                stopColor='#06b6d4'
                                stopOpacity={0.45}
                            />
                            <stop
                                offset='95%'
                                stopColor='#06b6d4'
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
                                stopColor='#d946ef'
                                stopOpacity={0.3}
                            />
                            <stop
                                offset='95%'
                                stopColor='#d946ef'
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis
                        domain={['auto', 'auto']}
                        type='number'
                        dataKey='date'
                        tickLine={false}
                        axisLine={false}
                        minTickGap={5}
                        padding={{ left: 10, right: 10 }}
                        interval="preserveStartEnd"
                        style={{
                            fontSize: "12px",
                            fontFamily: "Inter; Helvetica",
                            color: "red",
                          }}
                        tick={{ transform: "translate(0, 6)" }}
                    />
                    <YAxis
                        tickFormatter={(value: number, index: number) =>
                            formatDollar(value, 'standard')
                        }
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
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
                            // fill="url(#colorUv)"
                            fill={
                                s.name === currentMonth
                                    ? `url(#${prevMonth}) `
                                    : `url(#${currentMonth})`
                            }
                            strokeWidth={2}
                            // opacity={s.name === currentMonth ? 1 : 0.7}
                            stroke={
                                s.name === currentMonth ? '#d946ef' : '#06b6d4'
                            }
                            isAnimationActive={false}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
}
