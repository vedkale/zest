"use client";

import { db } from "@/lib/db";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function syncTransactions(ids: { id: number }[]) {
    const res = ids.map(async (id) => {
        const response = fetch(`/api/transactions/?id=${id.id}`, {
            method: "POST",
        });

        return response;
        // if (!response?.ok) {
        //     //   toast({
        //     //     title: "Something went wrong.",
        //     //     description: "Your post was not deleted. Please try again.",
        //     //     variant: "destructive",
        //     //   })
        //     console.error(`Account delete failed for id: ${id}`);
        //     return false;
        // }
    });

    await Promise.all(res);

    return true;
}

export function SyncTransactionsButton({ ids }: { ids: { id: number }[] }) {
    const [isSyncLoading, setIsSyncLoading] = useState<boolean>(false);
    const router = useRouter();

    return (
        <button
            className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-md p-2"
            onClick={async (event) => {
                event.preventDefault();
                setIsSyncLoading(true);

                const response = await syncTransactions(ids);

                if (response) {
                    setIsSyncLoading(false);
                    router.refresh();
                }
            }}
        >
            Sync Transactions
        </button>
    );
}
