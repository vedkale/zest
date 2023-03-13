import { ItemType } from "@/lib/types";
import { formatDollar } from "@/lib/utils";
import { AccountBase } from "plaid";

export default function AccountItem({ account }: { account: AccountBase }) {
    return (
        <div>
            <div className="flex items-center justify-between p-4 mx-12">
                <div className="grid gap-1">
                    <p>{account.name}</p>
                </div>
                <div>
                    <p>{`Balance: ${formatDollar(account.balances.current)}`}</p>
                </div>
            </div>
        </div>
    );
}
