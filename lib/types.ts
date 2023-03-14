export interface ItemType {
    id: string;
    access_token: string;
    item_id: string;
    institution_id: string;
    transaction_cursor: string;
    created: string;
    updated: string;
}

export interface GetAllItemsResponse {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: ItemType[];
}