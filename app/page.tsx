import { db } from "@/lib/db";
import { cache } from "react";
import { cumsumDate } from "@/lib/utils";
import TimeChart from "@/components/TimeChart";
import { SyncTransactionsButton } from "@/components/SyncTransactionsButton";
import PieChart from "@/components/PieChart";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import PlaidLink from "@/components/PlaidLink";
import clsx from "clsx";
import Sankey from "@/components/SankeyDiagram";
import { format } from "date-fns";

const getTransactionsAgg = cache(async (month: number, year: number) => {
    //@ts-ignore
    return db.transaction.groupBy({
        by: ["date"],
        where: {
            date: {
                gt: new Date(year, month, 1),
                lte: new Date(year, month + 1, 0),
            },
        },
        _sum: {
            amount: true,
        },
    });
});

const sankeyData = cache(async (month: number, year: number) => {
    //@ts-ignore
    return await db.transaction.groupBy({
        by: ["category", "subcategory"],
        where: {
            date: {
                gt: new Date(year, month, 1),
                lt: new Date(year, month + 1, 0),
            },
        },
        _sum: {
            amount: true,
        },
        having: {
            amount: {
                _sum: {
                    gt: 0, //this doesnt include negative values so need to do somethiing for credits
                },
            },
        },
    });
});

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

    const sankey = await sankeyData(now.getMonth() - 1, now.getFullYear());

    return (
        <main className="mr-4">
            <div className="flex justify-between pb-5">
                <h1 className="flex justify-between px-2 text-xl font-bold">
                    Home
                </h1>
                {/* <SyncTransactionsButton ids={ids} /> */}
            </div>
            <div
                className={clsx({
                    hidden: ids.length > 0,
                })}
            >
                <EmptyPlaceholder>
                    <EmptyPlaceholder.Title>
                        No Accounts found
                    </EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                        You don&apos;t have any accounts added yet. Let&apos;s
                        add one.
                    </EmptyPlaceholder.Description>
                    <PlaidLink />
                </EmptyPlaceholder>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="min-h-min min-w-min rounded-md border border-slate-700 p-3">
                    <h1 className="py-1 font-bold">Monthly Spend</h1>
                    {/* <p className=" items-center justify-center">{`${1}$ spent🤠`}</p> */}
                    <TimeChart
                        data={currentMonthSpend.map((x) => {
                            return {
                                date: x.date.toISOString(),
                                amount: x.amount,
                            };
                        })}
                        prevData={prevMonthSpend.map((x) => {
                            return {
                                date: x.date.toISOString(),
                                amount: x.amount,
                            };
                        })}
                        currentMonth={format(now, "MMMM")}
                        prevMonth={format(
                            new Date(now.getFullYear(), now.getMonth() - 1, 1),
                            "MMMM"
                        )}
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
            </div>
            <div className="mt-4 rounded-md border border-slate-700">
                <Sankey data={sankey}></Sankey>
            </div>
        </main>
    );
}
