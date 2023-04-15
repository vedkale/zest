'use client';

import { useCallback, useTransition } from 'react';
import FilterOptions from './FilterOptions';
import { Input } from './ui/Input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SortOptions from './SortOptions';

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

    
    function onChange(e: { target: { value: any } }) {
        startTransition(() => {
            router.replace(
                `/transactions?${createQueryString('search', e.target.value)}`
            );
        });
    }

    return (
        <>
            <div className="mr-2">
                <FilterOptions accounts={accounts} categories={categories} />
            </div>
            <div className="mr-2">
                <SortOptions />
            </div>
            <Input
                placeholder="Search"
                type="search"
                onChange={onChange}
                defaultValue={searchValue}
            />
        </>
    );
}
