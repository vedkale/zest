"use client";

import { Icons } from "@/components/Icons";
import Image from "next/image";
import useSWR from "swr";

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
