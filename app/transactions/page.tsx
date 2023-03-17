import { GetAllTransactionsResponse } from "@/lib/types";

const getAllTransactions = async () => {
    const response = await fetch(
        "http://127.0.0.1:8090/api/collections/transactions_table/records",
        { cache: "no-store" }
    );
    const data: GetAllTransactionsResponse = await response.json();
    return data;
};

export default async function Transactions() {
    const allTransactions = await getAllTransactions();

    console.log(JSON.stringify(allTransactions));

    return (
        <main>
            <div>
                <h1 className="font-bold text-xl px-2 flex justify-between">
                    Transactions
                </h1>

            </div>
        </main>
    );
}
