import { z } from "zod";

import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

const searchSchema = z.object({
    q: z.string().min(1),
});
export default defineAuthenticatedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, searchSchema.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
            signal: AbortSignal.timeout(5000),
            headers: {
                "User-Agent": "nuxt-travel-log | 0917272",
            },
        });

        if (!response.ok) {
            return sendError(event, createError({
                statusCode: 504,
                statusMessage: "Unable to connect to the server",
            }));
        }
        const results = await response.json();
        return results;
    }
    catch {
        return sendError(event, createError({
            statusCode: 504,
            statusMessage: "Unable to connect to the server",
        }));
    }
});
