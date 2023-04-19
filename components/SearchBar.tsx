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
import { Icons } from './Icons';
import { Input } from './ui/Input';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const sortStates = {
    'Sort by Date': 0,
    'Sort by Amount (high to low)': 1,
    'Sort by Amount (low to high)': 2,
};

export default function SearchBar({
    searchValue,
    accounts,
    categories,
}: {
    searchValue: string;
    accounts: string[];
    categories: string[];
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [sortState, setSortState] = useState<number>(0);
    const [filterQuery, setFilterQuery] = useState<Set<string>>(
        new Set<string>()
    );

    const filterCategories: { [key: string]: string[] } = {
        Account: accounts,
        Category: categories,
    };

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams]
    );

    function handleSearch(value: string) {
        startTransition(() => {
            router.replace(
                `/transactions?${createQueryString('search', value)}`
            );
        });
    }

    useEffect(() => {
        startTransition(() => {
            router.replace(
                `/transactions?${createQueryString(
                    'sort',
                    sortState.toString()
                )}`
            );
        });
        // this might cause problems later...
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortState]);

    useEffect(() => {
        startTransition(() => {
            router.replace(
                `/transactions?${Array.from(filterQuery).map((item) => createQueryString('filter', item)).join('&')}`
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterQuery]);

    return (
        <>
            <div className='flex flex-row'>
                <div className='mr-2'>
                    {/* --<Filter Options>-- */}
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
                                                                        ).add(
                                                                            `${heading}-${item}`
                                                                        )
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
                </div>
                <div className='mr-2'>
                    {/* --<Sort Options>-- */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className='flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 transition-colors hover:bg-slate-800'>
                            {isPending ? (
                                <Icons.spinner className='h-4 w-4 animate-spin' />
                            ) : (
                                <Icons.sliders className='h-4 w-4' />
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {Object.entries(sortStates).map(
                                ([state, value]) => {
                                    return (
                                        <DropdownMenuItem
                                            key={state}
                                            className='flex cursor-pointer items-center focus:bg-slate-50'
                                            // onSelect={() => setSortState(value)}
                                            onSelect={() => {
                                                setSortState(value);
                                            }}
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
                                }
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Input
                    placeholder='Search'
                    type='search'
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                    defaultValue={searchValue}
                />
            </div>
            {filterQuery.size > 0 && (
                <div className='flex flex-row'>
                    {Array.from(filterQuery).map((item) => {
                        return (
                            <button
                                className='mr-1 flex flex-row items-center rounded-md border border-slate-700 p-2 text-sm text-slate-400'
                                key={item}
                                id={item}
                                onClick={(e) => {
                                    filterQuery.delete(e.currentTarget.id);
                                    setFilterQuery(new Set(filterQuery));
                                }}
                            >
                                {item.split('-')[1]}
                                <Icons.X className='ml-1 h-4 w-4' />
                            </button>
                        );
                    })}
                </div>
            )}
        </>
    );
}
