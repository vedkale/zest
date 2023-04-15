'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { Icons } from './Icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function FilterOptions({
    accounts,
    categories,
}: {
    accounts: string[];
    categories: string[];
    // earliestDate: Date;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [filterQuery, setFilterQuery] = useState<Set<string>>(
        new Set<string>()
    );
    const [isPending, startTransition] = useTransition();

    const filterCategories: { [key: string]: string[] } = {
        Account: accounts,
        Category: categories,
    };

    function triggerFilter(value: Set<string>) {
        startTransition(() => {
            router.replace(
                `/transactions?${createQueryString('filter', value)}`
            );
        });
    }

    const createQueryString = useCallback(
        (name: string, value: Set<string>) => {
            const params = new URLSearchParams(searchParams);
            if (value.size === 0) {
                params.delete(name);
            } else {
                params.set(name, Array.from(value).toString());
            }

            return params.toString();
        },
        [searchParams]
    );

    useEffect(() => {
        // startTransition(() => {
        //     router.replace(
        //         `/transactions?${createQueryString('sort', filterQuery.toString())}`
        //     );
        // });
        console.log(filterQuery);
    }, [createQueryString, filterQuery, router]);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className='flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 transition-colors hover:bg-slate-800'>
                    {isPending ? (
                        <Icons.spinner className='h-4 w-4 animate-spin' />
                    ) : (
                        <Icons.filter className='h-4 w-4' />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {Object.keys(filterCategories).map((heading) => {
                        return (
                            <DropdownMenuSub key={heading}>
                                <DropdownMenuSubTrigger>
                                    {heading}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        {filterCategories[heading].map(
                                            (item) => {
                                                return (
                                                    <DropdownMenuItem
                                                        key={item}
                                                        onSelect={() => {
                                                            setFilterQuery(
                                                                new Set(
                                                                    filterQuery
                                                                ).add(item)
                                                            );
                                                        }}
                                                    >
                                                        {item}
                                                    </DropdownMenuItem>
                                                );
                                            }
                                        )}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
