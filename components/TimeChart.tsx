"use client";

import { formatDollar } from "@/lib/utils";
import {
    Chart as ChartJS,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
    TimeScale,
    Title,
    SubTitle,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    SubTitle,
    Title,
    Tooltip
);

const date = new Date();

export const options = {
    responsive: true,
    layout: {
        padding: 20,
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false,
        },
        title: {
            display: true,
            text: "Monthly Spend",
        },
        subtitle: {
            display: true,
            text: "Chart Subtitle",
        },
    },
    scales: {
        x: {
            type: "time",
            time: {
                unit: "day",
            },
            grid: {
                display: false,
            },
            border: {
                color: "white",
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
            grid: {
                display: false,
            },
            border: {
                color: "white",
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
    prevData,
    labels,
    title,
    subtitle,
}: {
    data: number[];
    prevData: number[];
    labels: string[];
    title: string;
    subtitle: string;
}) {
    options.plugins.title.text = title;
    options.plugins.subtitle.text = subtitle;
    const dateData = data.map((x) => {
        return new Date(x);
    });
    const prevDateData = prevData.map((x) => {
        return new Date(x);
    });
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Monthly Spend",
                data: dateData,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(0, 99, 132, 1)",
                tension: 0.3,
            },
            {
                label: "Prev Spend",
                data: prevDateData,
                borderColor: "rgb(255, 255, 255)",
                backgroundColor: "rgba(0, 99, 132, 0.5)",
                tension: 0,
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
