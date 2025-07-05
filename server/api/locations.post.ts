import type { DrizzleError } from "drizzle-orm";

import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertLocation.safeParse);

    if (!event.context.user) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        }));
    }

    if (!result.success) {
        const statusMessage = result
            .error
            .issues
            .map(issue => `${issue.path.join("")}: ${issue.message}`)
            .join("; ");

        const data = result
            .error
            .issues
            .reduce((errors, issue) => {
                errors[issue.path.join("")] = issue.message;
                return errors;
            }, {} as Record<string, string>);

        return sendError(event, createError({
            statusCode: 422,
            statusMessage,
            data,
        }));
    }

    const slug = slugify(result.data.name);
    let existing = !!(await db.query.location.findFirst({
        where: eq(location.slug, slug),
    }));

    while (existing) {
        const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

        const idSlug = `${slug}-${nanoid}`;

        existing = !!(await db.query.location.findFirst({
            where: eq(location.slug, idSlug),
        }));
    }

    try {
        const [created] = await db.insert(location).values({
            ...result.data,
            slug,
            userId: event.context.user.id,
        }).returning();

        return created;
    }
    catch (err) {
        const error = err as DrizzleError;

        if (error.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
            return sendError(event, createError({
                statusCode: 409,
                statusMessage: "The Name must be unique",
            }));
        }

        console.log(error.message);
        throw error;
    }
});
