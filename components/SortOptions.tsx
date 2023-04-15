'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { Icons } from './Icons';
import { useRouter, useSearchParams } from 'next/navigation';

const sortStates = {
    'Sort by Date': 0,
    'Sort by Amount (high to low)': 1,
    'Sort by Amount (low to high)': 2,
};

export default function SortOptions() {
    const [isPending, startTransition] = useTransition();
    const [sortState, setSortState] = useState<number>(0);
    const searchParams = useSearchParams();
    const router = useRouter();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            if (value && value !== '0') {
                params.set(name, value);
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams]
    );

    useEffect(() => {
        startTransition(() => {
            router.replace(
                `/transactions?${createQueryString(
                    'sort',
                    sortState.toString()
                )}`
            );
        });
    }, [createQueryString, router, sortState]);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className='flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 transition-colors hover:bg-slate-800'>
                    {isPending ? (
                        <Icons.spinner className='h-4 w-4 animate-spin' />
                    ) : (
                        <Icons.sliders className='h-4 w-4' />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {Object.entries(sortStates).map(([state, value]) => {
                        return (
                            <DropdownMenuItem
                                key={state}
                                className='flex cursor-pointer items-center focus:bg-slate-50'
                                onSelect={() => setSortState(value)}
                            >
                                {sortState === value ? (
                                    <>
                                        {isPending ? (
                                            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                                        ) : (
                                            <Icons.check className='mr-2 h-4 w-4' />
                                        )}
                                        {state}
                                    </>
                                ) : (
                                    <p className='ml-6'>{state}</p>
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
