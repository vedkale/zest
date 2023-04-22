"use client";

import { Prisma } from "@prisma/client";
import {
    Layer,
    Rectangle,
    ResponsiveContainer,
    Sankey,
    Tooltip,
} from "recharts";

const MyCustomNode = ({
    x,
    y,
    width,
    height,
    index,
    payload,
    containerWidth,
}: {
    x: any;
    y: any;
    width: any;
    height: any;
    index: any;
    payload: any;
    containerWidth: any;
}) => {
    const isOut = x + width + 6 > containerWidth;
    return (
        <Layer key={`CustomNode${index}`}>
            <Rectangle
                x={x}
                y={y}
                width={width}
                height={height}
                fill="#06b6d4"
                fillOpacity="1"
            />
            <text
                textAnchor={isOut ? "end" : "start"}
                x={isOut ? x - 6 : x + width + 6}
                y={y + height / 2}
                fontSize="14"
                // stroke="#FFF"
                fill="#FFF"
            >
                {payload.name}
            </text>
            <text
                textAnchor={isOut ? "end" : "start"}
                x={isOut ? x - 6 : x + width + 6}
                y={y + height / 2 + 13}
                fontSize="12"
                // stroke="#FFF"
                strokeOpacity="1"
                fill="#FFF"
            >
                {`$${payload.value}`}
            </text>
        </Layer>
    );
};

function createMappings(
    data: (Prisma.PickArray<
        Prisma.TransactionGroupByOutputType,
        ("category" | "subcategory")[]
    > & {
        _sum: {
            amount: number | null;
        };
    })[]
) {
    const mappings: { [key: string]: number } = {};
    var count = 1;
    var total = 0;
    mappings["Income"] = 0;
    for (const d of data) {
        const category = d.category || "Uncategorized";
        const subcategory = d.subcategory || "Uncategorized";
        if (!mappings[category]) {
            mappings[category] = count;
            count++;
        }
        if (!mappings[subcategory]) {
            mappings[subcategory] = count;
            count++;
        }
        total += d._sum.amount || 0;
    }
    return { mappings, total };
}

export default function SankeyDiagram({
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
    const mappingData = createMappings(data);
    const { mappings, total } = mappingData;

    const chartData = {
        nodes: Object.keys(mappings).map((key) => ({ name: key })),
        links: [
            ...data.flatMap((d) => [
                {
                    source: mappings[d.category ?? "Uncategorized"],
                    target: mappings[d.subcategory ?? "Uncategorized"],
                    value: d._sum.amount,
                },
                {
                    source: mappings["Income"],
                    target: mappings[d.category ?? "Uncategorized"],
                    value: d._sum.amount,
                },
            ]),
        ],
    };

    return (
        <>
            <ResponsiveContainer aspect={16/9}>
                <Sankey
                    width={960}
                    height={500}
                    data={chartData}
                    //@ts-expect-error
                    node={<MyCustomNode />}
                    // node={{ stroke: "#77c878", strokeWidth: 2 }}
                    nodePadding={50}
                    margin={{
                        left: 100,
                        right: 200,
                        top: 50,
                        bottom: 50,
                    }}
                    link={{ stroke: "#6366f1" }}
                >
                    {/* <Tooltip /> */}
                </Sankey>
            </ResponsiveContainer>
        </>
    );
}
