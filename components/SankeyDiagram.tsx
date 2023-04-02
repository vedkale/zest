"use client";

import { Prisma } from "@prisma/client";
import { Chart } from "chart.js";
import { SankeyController, Flow } from "chartjs-chart-sankey";
// import ChartDataLabels from "chartjs-plugin-datalabels";

// Chart.register(SankeyController, Flow);

export default function Sankey({
    data,
}: {
    data: (Prisma.PickArray<
        Prisma.TransactionGroupByOutputType,
        ("category" | "subcategory")[]
    > & {
        _sum: {
            amount: number | null;
        };
    })[];
}) {
    // const flows = data.map((d) => {
    //     return {
    //         from: d.category,
    //         to: d.subcategory,
    //         flow: d._sum.amount,
    //     };
    // });

    // console.log("flows", flows);

    const colors: { [key: string]: string } = {
        a: "red",
        b: "green",
        c: "blue",
        d: "gray",
    };

    const getColor = (key: string) => {
        return colors[key];
    };

    const chartData = {
        datasets: [
            {
                label: "My sankey",
                data: [
                    { from: "a", to: "b", flow: 10 },
                    { from: "a", to: "c", flow: 5 },
                    { from: "b", to: "c", flow: 10 },
                    { from: "d", to: "c", flow: 7 },
                ],
                // colorFrom: (c: any) => getColor(c.dataset.data[c.dataIndex].from),
                // colorTo: (c: any) => getColor(c.dataset.data[c.dataIndex].to),
                colorMode: "gradient", // or 'from' or 'to'
                /* optional labels */
                labels: {
                    a: "Label A",
                    b: "Label B",
                    c: "Label C",
                    d: "Label D",
                },
                /* optional priority */
                priority: {
                    b: 1,
                    d: 0,
                },
                /* optional column overrides */
                column: {
                    d: 1,
                },
                size: "max", // or 'min' if flow overlap is preferred
            },
        ],
    };

    // const chart = new Chart(ctx, {
    //     type: "sankey",
    //     data: {},
    // });

    // return <Chart type="sankey" data={chartData} options={}/>;
    return (<></>);
}
