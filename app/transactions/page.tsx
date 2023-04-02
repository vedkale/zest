import { db } from "@/lib/db";
import { cache } from "react";
import { ScrollArea } from "@/components/ui/ScrollArea";
import SearchBar from "@/components/SearchBar";
import { Account, Transaction } from "@prisma/client";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import PlaidLink from "@/components/PlaidLink";
import { SyncTransactionsButton } from "@/components/SyncTransactionsButton";

const getTransactions = cache(async () => {
    return await db.transaction.findMany({
        include: {
            Account: true,
        },
        orderBy: {
            date: "desc",
        },
    });
});

function filterTransaction(
    transactions: (Transaction & {
        Account: Account;
    })[],
    search: string
) {
    const keywords = search
        .toLowerCase()
        .split(" ")
        .filter((s) => s !== "");
    if (keywords.length === 0) {
        return transactions;
    }
    return transactions.filter((transaction) => {
        const words = transaction.name.toLowerCase().split(" ");
        return keywords.every((kw) => words.some((w) => w.includes(kw)));
    });
}

const getIds = cache(async () => {
    return await db.item.findMany({ select: { id: true } });
});

export default async function Transactions({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const ids = await getIds();
    const transactions = await getTransactions();
    const filteredTransactions = filterTransaction(
        transactions,
        (searchParams.search as string) ?? ""
    );

    return (
        <main className="max-h-3.5">
            <div className="grid items-start gap-4">
                <div className="flex justify-between">
                    <h1 className="flex justify-between px-2 text-xl font-bold">
                        Transactions
                    </h1>
                    <SyncTransactionsButton ids={ids} />
                </div>
                <div className="flex flex-row">
                    <SearchBar />
                </div>
                {filteredTransactions?.length ? (
                    <div>
                        <ScrollArea className="h-[80vh] rounded-md border border-slate-700 p-4">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Category</th>
                                        <th>Account</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction) => {
                                        return (
                                            <tr
                                                className="m-0 border-t border-slate-200 p-0"
                                                key={transaction.transaction_id}
                                            >
                                                <td className="text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {transaction.name}
                                                </td>
                                                <td className="text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {transaction.date.toLocaleDateString()}
                                                </td>
                                                <td className="text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {Math.sign(
                                                        transaction.amount
                                                    ) === 1 ? (
                                                        <p className="text-red-500">
                                                            $
                                                            {transaction.amount}
                                                        </p>
                                                    ) : (
                                                        <p className="text-green-500">
                                                            $
                                                            {Math.abs(
                                                                transaction.amount
                                                            )}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {transaction.category}
                                                </td>
                                                <td className="text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right">
                                                    {transaction.Account.name}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </ScrollArea>
                    </div>
                ) : transactions?.length ? (
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Title>
                            No transaction found
                        </EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            Try searching for something else.
                        </EmptyPlaceholder.Description>
                    </EmptyPlaceholder>
                ) : (
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Title>
                            No transaction found
                        </EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any accounts added yet.
                            Let&apos;s add one
                        </EmptyPlaceholder.Description>
                        <PlaidLink />
                    </EmptyPlaceholder>
                )}
            </div>
        </main>
    );
}
