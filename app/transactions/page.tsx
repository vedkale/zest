import { db } from "@/lib/db";
import { Transaction } from "@prisma/client";
import { cache } from "react";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Input } from "@/components/ui/Input";
import AccountOperations from "@/components/AccountOperations";
import FilterOptions from "@/components/FilterOptions";

const getTransactions = cache(async () => {
    return await db.transaction.findMany({
        orderBy: {
            date: "desc",
        },
    });
});

export default async function Transactions() {
    const transactions = await getTransactions();
    return (
        <main className="max-h-3.5">
            <div className="grid items-start gap-4">
                <div className="flex justify-between">
                    <h1 className="font-bold text-xl px-2 flex justify-between">
                        Transactions
                    </h1>
                </div>
                <div className="flex flex-row">
                    <Input placeholder="Search" type="search" />
                    <div className="px-2">
                        <FilterOptions />
                    </div>
                </div>
                <div className="">
                    <ScrollArea className="h-[80vh] rounded-md border border-slate-700 p-4">
                        <table>
                            <thead className="m-0 p-0">
                                <tr>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Category</th>
                                    <th>Pending</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(
                                    (transaction: Transaction) => {
                                        return (
                                            <tr
                                                className="m-0 border-t border-slate-200 p-0"
                                                key={transaction.account_id}
                                            >
                                                <td className="px-10 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {transaction.name}
                                                </td>
                                                <td className="px-10 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {transaction.date.toLocaleDateString()}
                                                </td>
                                                <td className="px-10 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {transaction.amount}
                                                </td>
                                                <td className="px-10 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {transaction.category}
                                                </td>
                                                <td className="px-10 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {transaction.pending
                                                        ? "Yes"
                                                        : "No"}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </ScrollArea>
                </div>
            </div>
        </main>
    );
}
