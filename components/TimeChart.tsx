"use client";

import { formatDollar } from "@/lib/utils";
import {
    Chart as ChartJS,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
    ChartOptions,
    TimeScale,
    Legend,
    Title,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
);

const date = new Date();

export const options = {
    response: true,
    maintainAspectRation: false,
    plugins: {
    },
    scales: {
        x: {
            type: "time",
            time: {
                unit: "day",
            },
        },
        y: {
            type: "linear",
            beginAtZero: true,
            display: true,
            ticks: {
                // Include a dollar sign in the ticks
                callback: function (value: any, index: any, ticks: any) {
                    return formatDollar(value);
                },
            },
        },
    },
    elements: {
        point: {
            radius: 0,
        },
    },
};

//data: number[], labels: string[]
export default function TimeChart({
    data,
    labels,
}: {
    data: number[];
    labels: Date[];
}) {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "AAAAAAAA",
                data: data,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(0, 99, 132, 0.5)",
                tension: 0.3,
            },
        ],
    };

    return (
        <>
            {/* 
            // @ts-ignore god help ts */}
            <Line options={options} data={chartData} />
        </>
    );
}
