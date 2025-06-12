import db from "~/lib/db";
import { InsertLocation } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertLocation.safeParse);

    if (!result.success) {
        const statusMessage = result.error.issues.map(issue => `${issue.path.join("")}: ${issue.message}`).join("; ");
        return sendError(event, createError({
            statusCode: 422,
            statusMessage,
        }));

        const data = result.error.issues.reduce((errors, issue) => {
            return errors[issue.path.join("")] = issue.message;
        }, {} as Record<string, string>);

        return sendError(event, createError({
            statusCode: 422,
            statusMessage,
            data,
        }));
    }

    db.insert(location).values({
        ...result.data,
        userId: 1,
        slug: result.data?.name.replaceAll(" ", "-".toLowerCase()),
    });

    return result.data;
});
