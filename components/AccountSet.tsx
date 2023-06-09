import { Account } from "@prisma/client";
import AccountItem from "./AccountItem";
import AccountOperations from "./AccountOperations";

export default function AccountSet({
    accounts,
    institution_name,
    record_id,
}: {
    accounts: Account[];
    institution_name: string;
    record_id: number;
}) {
    return (
        <>
            <div className="divide-y divide-neutral-700 rounded-xl border-2 border-slate-700">
                <div className="flex items-center justify-between p-4">
                    <div className="grid gap-1">
                        <p>{institution_name}</p>
                    </div>
                    <AccountOperations record_id={record_id} />
                </div>
                {accounts.map((account) => {
                    return (
                        <AccountItem
                            key={account.account_id}
                            account={account}
                        />
                    );
                })}
            </div>
        </>
    );
}
