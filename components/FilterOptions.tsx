import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "./Icons";

export default function FilterOptions() {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 transition-colors hover:bg-slate-800">
                    <Icons.vEllipsis className="h-4 w-4" />
                </DropdownMenuTrigger>
            </DropdownMenu>
        </>
    );
}
