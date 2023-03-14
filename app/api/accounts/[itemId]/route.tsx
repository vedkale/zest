export async function DELETE(request: Request, context: { params: any }) {
    const params = context.params;
    const response = await fetch(
        `http://127.0.0.1:8090/api/collections/items_table/records/${params.itemId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response;
}
