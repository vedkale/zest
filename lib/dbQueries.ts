import { cache } from "react";
import { db } from "./db";

export const getItemIds = cache(async () => {
    return await db.item.findMany({
        select: {
            id: true
        }
    });
});