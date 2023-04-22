'use client';

import { Prisma } from '@prisma/client';
import { BarList } from '@tremor/react';

function aggregateData(
    data: (Prisma.PickArray<
        Prisma.TransactionGroupByOutputType,
        ('category' | 'subcategory')[]
    > & {
        _sum: {
            amount: number | null;
        };
    })[]
) {
    const aggData: {[key: string]: number} = {};
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.category) {
            if (aggData[element.category]) {
                aggData[element.category] += element._sum.amount ?? 0;
            }
            else {
                aggData[element.category] = element._sum.amount ?? 0;
            }
        }
    }

    return Object.entries(aggData).sort((a, b) => b[1] - a[1]);
}

export default function TopCategories({
    data,
}: {
    data: (Prisma.PickArray<
        Prisma.TransactionGroupByOutputType,
        ('category' | 'subcategory')[]
    > & {
        _sum: {
            amount: number | null;
        };
    })[];
}) {
    const barData = aggregateData(data).map(([key, value]) => {return {name: key, value: value}});

    return (
        <>
            <BarList data={barData} color='cyan' className='mt-2'/>
        </>
    );
}
