import { db } from "@/lib/db";
import { cache } from "react";
import { cumsumDate } from "@/lib/utils";
import TimeChart from "@/components/TimeChart";
import { SyncTransactionsButton } from "@/components/SyncTransactionsButton";
import PieChart from "@/components/PieChart";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import PlaidLink from "@/components/PlaidLink";
import clsx from "clsx";
import { client } from "@/lib/plaidClient";
import Sankey from "@/components/SankeyDiagram";

const getTransactionsAgg = cache(async (month: number, year: number) => {
    //@ts-ignore
    return db.transaction.groupBy({
        by: ["date"],
        where: {
            date: {
                gt: new Date(year, month, 1),
                lt: new Date(year, month + 1, 1),
            },
        },
        _sum: {
            amount: true,
        },
    });
});

const getTransactionsAggCategory = cache(
    async (month: number, year: number) => {
        //@ts-ignore
        return await db.transaction.groupBy({
            by: ["category"],
            where: {
                date: {
                    gt: new Date(year, month, 1),
                    lt: new Date(year, month + 1, 1),
                },
                NOT: {
                    category: {
                        contains: "payment",
                    },
                },
            },
            _sum: {
                amount: true,
            },
        });
    }
);

const sankeyData = cache(
    async (month: number, year: number) => {
        //@ts-ignore
        return await db.transaction.groupBy({
            by: ["category", "subcategory"],
            where: {
                date: {
                    gt: new Date(year, month, 1),
                    lt: new Date(year, month + 1, 1),
                },
                // NOT: {
                //     category: {
                //         contains: "payment",
                //     },
                // },
            },
            _sum: {
                amount: true,
            },
        });
    }
);

const getIds = cache(async () => {
    return await db.item.findMany({ select: { id: true } });
});

export default async function Home() {
    const now = new Date();

    const ids = await getIds();

    const currentMonthSpend = cumsumDate(
        await getTransactionsAgg(now.getMonth() - 1, now.getFullYear())
    );
    const prevMonthSpend = cumsumDate(
        await getTransactionsAgg(now.getMonth() - 2, now.getFullYear())
    );
    const currentSpendByCategory = await getTransactionsAggCategory(
        now.getMonth() - 1,
        now.getFullYear()
    );
    const prevSpendByCategory = await getTransactionsAggCategory(
        now.getMonth() - 2,
        now.getFullYear()
    );

    const sankey = await sankeyData(now.getMonth() - 1, now.getFullYear());
    // console.log(sankey);

    const response = await client.categoriesGet({});
    const categories = response.data.categories;

    return (
        <main>
            <div className="flex justify-between pb-5">
                <h1 className="flex justify-between px-2 text-xl font-bold">
                    Home
                </h1>
                <SyncTransactionsButton ids={ids} />
            </div>
            <div
                className={clsx("", {
                    hidden: ids.length > 0,
                })}
            >
                <EmptyPlaceholder>
                    <EmptyPlaceholder.Title>
                        No Accounts found
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        You don&apos;t have any accounts added yet. Let&apos;s
                        add one
                    </EmptyPlaceholder.Description>
                    <PlaidLink />
                </EmptyPlaceholder>
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="rounded-md border border-slate-700">
                    <TimeChart
                        data={currentMonthSpend.map((x) => {
                            return x.amount;
                        })}
                        prevData={prevMonthSpend.map((x) => {
                            return x.amount;
                        })}
                        labels={currentMonthSpend.map((x) => {
                            return x.date.toISOString();
                        })}
                        title={"Monthly Spend"}
                        subtitle={`Spent: $${
                            currentMonthSpend[currentMonthSpend.length - 1]
                                ?.amount
                        }`}
                    />
                </div>
                <div className="max-h-fit rounded-md border border-slate-700">
                    <PieChart
                        data={currentSpendByCategory.map((x) => {
                            return x._sum.amount!;
                        })}
                        labels={currentSpendByCategory.map((x) => {
                            return x.category!;
                        })}
                    />
                </div>
                <div className="rounded-md border border-slate-700 p-5">
                    <h1 className="py-1 font-bold">Spending Trends</h1>
                    <p>
                        Month over month spend increase:
                        {`${(
                            (100 *
                                (currentMonthSpend[currentMonthSpend.length - 1]
                                    ?.amount -
                                    prevMonthSpend[prevMonthSpend.length - 1]
                                        ?.amount)) /
                            currentMonthSpend[currentMonthSpend.length - 1]
                                ?.amount
                        ).toPrecision(2)}%`}
                    </p>
                </div>
                <div>
                    <Sankey data={sankey} />
                </div>
            </div>
        </main>
    );
}
