import { db } from "@/lib/db";
import Image from "next/image";
import { cache } from "react";
import useSWR from "swr";
import { cumsumDate } from "@/lib/utils";
import TimeChart from "@/components/TimeChart";

const getAllTransactions = cache(async () => {
    return await db.transaction.findMany({
        include: {
            Account: true,
        },
        orderBy: {
            date: "desc",
        },
    });
});

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

export default async function Home() {
    const now = new Date();
    var transactionForMonth = await getTransactionsAggCurrentMonth(
        now.getMonth(),
        now.getFullYear()
    );
    const monthlySpend = cumsumDate(transactionForMonth);
    console.log(monthlySpend);
    return (
        <main>
            <div>
                <h1 className="font-bold text-xl px-2 flex justify-between">
                    Dashboard
                </h1>
            </div>
            <div>
                <TimeChart
                    data={monthlySpend.map((x) => {
                        return x.amount;
                    })}
                    labels={monthlySpend.map((x) => {
                        return x.date;
                    })}
                />
            </div>
        </main>
    );
}
