"use client";

import { formatDollar } from "@/lib/utils";
import { ArcElement, Chart as ChartJS, Colors, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Colors, Legend);

export const options = {
    responsive: true,
    layout: {
        padding: 20,
    },
    aspectRatio: 0.8,
    cutout: '75%',
    radius: '80%',
    ticks: {
        // Include a dollar sign in the ticks
        callback: function (value: any, index: any, ticks: any) {
            return formatDollar(value);
        },
    },
    plugins: {
        title: {
            display: true,
            text: "Monthly Spend by Category",
        },
        legend: {
            display: true,
            position: 'right',
        }
    },
};

export default function PieChart({
    data,
    labels,
}: {
    data: number[];
    labels: string[];
}) {
    const chartData = {
        labels: labels,
        datasets: [
            {
                fill: false,
                labels: labels,
                data: data
            },
        ],
    };

    return (
        <>
            {/* 
            // @ts-ignore god help ts */}
            <Doughnut height={20} options={options} data={chartData} />
        </>
    );
}
