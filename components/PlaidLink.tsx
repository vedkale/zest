"use client";

import { useCallback, useEffect, useState } from "react";
import {
    PlaidLinkError,
    PlaidLinkOnExit,
    PlaidLinkOnExitMetadata,
    PlaidLinkOnSuccess,
    PlaidLinkOnSuccessMetadata,
    usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

export default function PlaidLink() {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const router = useRouter();

    const generateToken = async () => {
        const response = await fetch("/api/plaid").then((res) => res.text());
        setLinkToken((t) => (t = response));
    };

    useEffect(() => {
        generateToken();
    }, []);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        async (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
            // log and save metadata
            // exchange public token
            await fetch("/api/plaid", {
                method: "POST",
                body: JSON.stringify({
                    public_token: public_token,
                    institution_id: metadata.institution?.institution_id,
                }),
            });

            // forces a cache invalidation
            router.refresh();
            router.push("/accounts");
        },
        [router]
    );

    const onExit = useCallback<PlaidLinkOnExit>(
        (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
            // log and save error and metadata
            console.log("plaid link error", error);
            // handle invalid link token
            if (error != null && error.error_code === "INVALID_LINK_TOKEN") {
                // generate new link token
            }
            // to handle other error codes, see https://plaid.com/docs/errors/
        },
        []
    );

    const config: Parameters<typeof usePlaidLink>[0] = {
        token: linkToken!,
        onSuccess,
        onExit,
    };

    const { open, exit, ready } = usePlaidLink(config);

    return (
        <>
            <button
                className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-md p-2"
                onClick={() => {
                    open();
                }}
                disabled={!ready}
            >
                Link account
            </button>
        </>
    );
}
