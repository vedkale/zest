import { formatDollar } from "@/lib/utils";
import { Account } from "@prisma/client";

export default function AccountItem({ account }: { account: Account }) {
    return (
        <div>
            <div className="mx-12 flex items-center justify-between p-4">
                <div className="grid gap-1">
                    <p>{account.name}</p>
                </div>
                <div>
                    <p>{`Balance: ${formatDollar(account.balance_current)}`}</p>
                </div>
            </div>
        </div>
    );
}
