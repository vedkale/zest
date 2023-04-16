import { Account, Transaction } from '@prisma/client';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDollar(
    input: number | null,
    notation:
        | 'standard'
        | 'scientific'
        | 'engineering'
        | 'compact'
        | undefined = 'compact'
): string {
    if (!input) return '$0';
    return input.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: notation,
    });
}

export function cumsumDate(
    transactions: {
        _sum: {
            amount: number | null;
        };
        date: Date;
    }[]
) {
    const cumsum: { date: Date; amount: number }[] = [];
    for (let index = 0; index < transactions.length; index++) {
        const element = transactions[index];
        const amt = element._sum.amount ? element._sum.amount : 0;
        if (cumsum.length == 0) {
            cumsum.push({ date: element.date, amount: amt });
            continue;
        }
        cumsum.push({
            date: element.date,
            amount: amt + cumsum[cumsum.length - 1].amount,
        });
    }

    return cumsum;
}

export function amountSign(accountType: string) {
    if (accountType === 'depository') return -1;
    return 1;
}

export function searchTransactions(
    transactions: (Transaction & {
        Account: Account;
    })[],
    search: string
) {
    const keywords = search
        .toLowerCase()
        .split(' ')
        .filter((s) => s !== '');

    if (keywords.length === 0) {
        return transactions;
    }

    return transactions.filter((transaction) => {
        const words = transaction.name.toLowerCase().split(' ');
        return keywords.every((kw) => words.some((w) => w.includes(kw)));
    });
}

export function filterTransactions(
    transactions: (Transaction & {
        Account: Account;
    })[],
    filterArr: string[]
) {
    // if (!filterArr) {
    //     return transactions;
    // }

    const words = ['Plaid Checking'];
    return transactions
        .filter((transaction) => {
            return words.some((kw) => transaction.Account.name === kw);
        })
        .filter((transaction) => {
            return words.some((kw) => transaction.category === kw);
        });
}

export const Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
