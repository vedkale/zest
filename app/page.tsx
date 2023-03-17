import { Icons } from "@/components/Icons";
import { GetAllItemsResponse } from "@/lib/types";
import Image from "next/image";
import useSWR from "swr";

const getAllItems = async () => {
    const response = await fetch(
        "http://127.0.0.1:8090/api/collections/items_table/records",
        { cache: "no-store" }
    );
    const data: GetAllItemsResponse = await response.json();
    return data;
};

export default function Home() {
    return (
        <main>
            <div>
                <h1 className="font-bold text-xl px-2 flex justify-between">
                    Dashboard
                </h1>
            </div>
        </main>
    );
}
