import { ItemType } from "@/lib/types";
import { AccountBase, Institution } from "plaid";

export default function AccountItem({ account }: { account: AccountBase }) {
    console.log(JSON.stringify(account));
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <p>{account.name}</p>
                <p>{`Balance: ${account.balances.current}`}</p>
            </div>
            <div>
                <p>+</p>
            </div>
        </div>
    );
}
