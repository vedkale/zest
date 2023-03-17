export interface ItemType {
    id: string;
    access_token: string;
    item_id: string; //key
    institution_id: string;
    transaction_cursor: string;
    created: Date;
    updated: Date;
}

export interface GetAllResponse {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: any[];
}

export interface GetAllItemsResponse extends GetAllResponse {
    items: ItemType[];
}

export interface GetAllTransactionsResponse extends GetAllResponse {
    transactions: TransactionItem[];
}

export interface TransactionItem {
    account_id: string;
    plaid_transaction_id: string; //key
    plaid_category_id: string;
    category: string;
    subcategory: string;
    type: string;
    name: string;
    amount: number;
    iso_currency_code: string;
    unofficial_currency_code: string;
    date: Date;
    pending: boolean;
    account_owner: string;
    created: string;
    updated: string;
}

export interface AccountItem {
    item_id: string,
    plaid_account_id: string;
    name: string;
    mask: string;
    official_name: string;
    current_balance: number;
    available_balance: number;
    iso_currency_code: string;
    unofficial_currency_code: string;
    type: string;
    subtype: string;
}
