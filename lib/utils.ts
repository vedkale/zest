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
        | undefined = 'compact',
    maximumFractionDigits: number = 0
): string {
    if (!input) return '$0';
    return input.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: notation,
        maximumFractionDigits: maximumFractionDigits, 
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
    filterArr: { [key: string]: string[] }
) {
    if (!filterArr) {
        return transactions;
    }
    var filteredTransactions = transactions;
    if (filterArr.Account) {
        filteredTransactions = filteredTransactions.filter((transaction) => {
            return filterArr.Account.some(
                (f) => transaction.Account.name === f
            );
        });
    }
    if (filterArr.Category) {
        filteredTransactions = filteredTransactions.filter((transaction) => {
            return filterArr.Category.some((f) => transaction.category === f);
        });
    }

    return filteredTransactions;
}

export function queryParamsToFilterValues(params: string[] | string) {
    if (!params) {
        return {};
    }

    if (typeof params === 'string') {
        params = [params];
    }

    const obj: { [key: string]: string[] } = {};

    for (let i = 0; i < params.length; i++) {
        const [a, b] = params[i].split('-');
        obj[a] = [...(obj[a] || []), b];
    }

    return obj;
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
