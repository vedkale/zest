import { db } from '@/lib/db';
import { cache } from 'react';
import { ScrollArea } from '@/components/ui/ScrollArea';
import SearchBar from '@/components/SearchBar';
import { Account, Transaction } from '@prisma/client';
import { EmptyPlaceholder } from '@/components/EmptyPlaceholder';
import PlaidLink from '@/components/PlaidLink';
import { SyncTransactionsButton } from '@/components/SyncTransactionsButton';
import { filterTransactions, queryParamsToFilterValues, searchTransactions } from '@/lib/utils';
import { getItemIds } from '@/lib/dbQueries';

const sortByStates: { [key: string]: string }[] = [
    { date: 'desc' },
    { amount: 'desc' },
    { amount: 'asc' },
];

const getTransactions = cache(async (sortBy: { [key: string]: string }) => {
    return await db.transaction.findMany({
        include: {
            Account: true,
        },
        orderBy: {
            ...sortBy,
        },
    });
});

const createUniqueFilterValues = cache(
    (
        transactions: (Transaction & {
            Account: Account;
        })[]
    ) => {
        const accounts: Set<string> = new Set();
        const categories: Set<string> = new Set();
        for (let i = 0; i < transactions.length; i++) {
            accounts.add(transactions[i].Account.name);
            categories.add(transactions[i].category ?? 'Uncategorized');
        }
        return {
            accounts: Array.from(accounts),
            categories: Array.from(categories),
        };
    }
);

export default async function Transactions({
    searchParams,
}: {
    searchParams: { search: string; sort: string; filter: string[] | string };
}) {
    const search = searchParams.search ?? '';
    const sort = +searchParams.sort ?? 0;
    const filter = queryParamsToFilterValues(searchParams.filter);

    const transactions = await getTransactions(sortByStates[sort]);
    const itemIds = await getItemIds();

    var filteredTransactions = filterTransactions(transactions, filter);
    filteredTransactions = searchTransactions(filteredTransactions, search);
    const uniqueFilterValues = createUniqueFilterValues(transactions);
    

    return (
        <main className='max-h-3.5'>
            <div className='grid items-start gap-3'>
                <div className='flex justify-between'>
                    <h1 className='flex justify-between px-2 text-xl font-bold'>
                        Transactions
                    </h1>
                    <SyncTransactionsButton ids={itemIds} />
                </div>
                <SearchBar
                    searchValue={search}
                    accounts={uniqueFilterValues.accounts}
                    categories={uniqueFilterValues.categories}
                />
                {filteredTransactions?.length ? (
                    <div>
                        <ScrollArea className='h-[75vh] rounded-md border border-slate-700 p-4 max-h-full'>
                            <table className='w-full table-auto'>
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
                                                className='m-0 border-t border-slate-200 p-0'
                                                key={transaction.transaction_id}
                                            >
                                                <td className='text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                                                    {transaction.name}
                                                </td>
                                                <td className='text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                                                    {transaction.date.toLocaleDateString()}
                                                </td>
                                                <td className='text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                                                    {Math.sign(
                                                        transaction.amount
                                                    ) === 1 ? (
                                                        <p className='text-red-500'>
                                                            $
                                                            {transaction.amount}
                                                        </p>
                                                    ) : (
                                                        <p className='text-green-500'>
                                                            $
                                                            {Math.abs(
                                                                transaction.amount
                                                            )}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className='text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                                                    {transaction.category}
                                                </td>
                                                <td className='text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
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
