import { db } from "@/lib/db";

export async function DELETE(request: Request, context: { params: any }) {
    try {
        const item = await db.item.delete({
            where: {
                id: +context.params.id,
            },
        });

        return new Response(null, {status: 204});
    } catch (error) {
        console.error(`Account delete failed for id: ${context.params.id} with error ${error}`);
    }
}
