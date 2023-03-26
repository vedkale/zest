import { db } from "@/lib/db";
import { cache } from "react";
import useSWR from "swr";
import { cumsumDate } from "@/lib/utils";
import TimeChart from "@/components/TimeChart";
import { SyncTransactionsButton } from "@/components/SyncTransactionsButton";
import PieChart from "@/components/PieChart";

const getTransactionsAggCurrentMonth = cache(
    async (month: number, year: number) => {
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
    }
);

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

    const monthlySpend = cumsumDate(
        await getTransactionsAggCurrentMonth(now.getMonth(), now.getFullYear())
    );
    const spendByCategory = await getTransactionsAggCategory(
        now.getMonth(),
        now.getFullYear()
    );

    console.log(spendByCategory);

    return (
        <main>
            <div className="flex justify-between pb-5">
                <h1 className="font-bold text-xl px-2 flex justify-between">
                    Accounts
                </h1>
                <SyncTransactionsButton ids={ids} />
            </div>
            {/* <div className="grid grid-flow-col gap-2"> */}
            <div className="grid grid-flow-col auto-row-min gap-4">
                <div className="border rounded-md border-slate-700">
                    <TimeChart
                        data={monthlySpend.map((x) => {
                            return x.amount;
                        })}
                        labels={monthlySpend.map((x) => {
                            return x.date.toISOString();
                        })}
                        title={"Monthly Spend"}
                        subtitle={`Spent: $${monthlySpend[monthlySpend.length - 1].amount}`}
                    />
                </div>
                <div className="border rounded-md border-slate-700 max-h-fit">
                    <PieChart
                        data={spendByCategory.map((x) => {
                            return x._sum.amount!;
                        })}
                        labels={spendByCategory.map((x) => {
                            return x.category!;
                        })}

                    />
                </div>
                {/* <div className="border rounded-md border-slate-700 p-2">
                    <h1 className="">Stats</h1>
                    <p>Month over month spend increase: 5%</p>
                </div> */}
            </div>
        </main>
    );
}
