import { client } from "@/lib/plaidClient";
import { CountryCode, LinkTokenCreateRequest, Products } from "plaid";

export async function GET(request: Request) {
    const plaidRequest: LinkTokenCreateRequest = {
        user: {
            client_user_id: "user-id",
        },
        client_name: "Plaid Test App",
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: "en",
    };

    try {
        const response = await client.linkTokenCreate(plaidRequest);
        return new Response(response.data.link_token);
    } catch (error) {
        // handle error
        console.log(JSON.stringify(error));
        return null;
    }
}

export async function POST(request: Request) {
    const { public_token, institution_id } = await request.json();
    const response = await client.itemPublicTokenExchange({ public_token });

    const postData = {
        access_token: response.data.access_token,
        item_id: response.data.item_id,
        institution_id: institution_id,
    };

    try {
        const response = await fetch(
            "http://127.0.0.1:8090/api/collections/items_table/records",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            }
        );
        return response;
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}
