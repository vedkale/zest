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

export default function PlaidLink() {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const router = useRouter();

    const generateToken = async () => {
        const { token } = await fetch("/api/plaid").then((res) => res.json());
        setLinkToken((t) => (t = token));
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
                    institution_name: metadata.institution?.name,
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
                className="rounded-md bg-neutral-800 p-2 text-white hover:bg-neutral-700"
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
