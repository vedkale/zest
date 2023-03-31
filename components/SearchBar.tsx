'use client'

import { useTransition } from "react";
import FilterOptions from "./FilterOptions";
import { Input } from "./ui/Input";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function onChange(e: { target: { value: any; }; }) {  
        startTransition(() => {
            router.push("/transactions?search=" + e.target.value);
        });
    }

    return (
        <>
            <Input placeholder="Search" type="search" onChange={onChange} defaultValue={""} />
            <div className="px-2">
                <FilterOptions />
            </div>
        </>
    );
}
