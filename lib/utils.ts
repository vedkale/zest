import { Transaction } from "@prisma/client";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDollar(input: number | null): string {
    if (!input) return "$0";
    return input.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
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
    if (accountType === "depository") return -1;
    return 1;
}
