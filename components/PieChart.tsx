"use client";

import { formatDollar } from "@/lib/utils";

export const options = {
    responsive: true,
    layout: {
        padding: 20,
    },
    maintainAspectRatio: false,
    cutout: "70%",
    radius: "80%",
    ticks: {},
    plugins: {
        title: {
            display: true,
            text: "Monthly Spend by Category",
        },
        legend: {
            display: true,
            position: "right",
            labels: {
                color: "#FFFFFF",
            },
        },
        datalabels: {
            color: "#FFFFFF",
            formatter: function (value: any, context: any) {
                return formatDollar(value, "standard");
            },
            anchor: "end",
            clamp: false,
            align: "end",
            rotation: 0,
        },
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
                data: data,
            },
        ],
    };

    return (
        <>
        </>
    );
}
