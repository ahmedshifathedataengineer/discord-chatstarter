import { internalMutation, MutationCtx, query, QueryCtx } from "../_generated/server";
//Can't call from frontend, will call from http action
//or from another function within Convex API
import { v} from "convex/values";

export const get = query({
    handler: async (ctx) => {
        return await getCurrentUser(ctx);
    },
});

export const upsert = internalMutation({
    args: {
        username: v.string(),
        image: v.string(),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUserbyClerkId(ctx, args.clerkId);

        if (user) {
            await ctx.db.patch(user._id, {
                username: args.username,
                image: args.image,
            });
        } else {
            await ctx.db.insert("users", {
                username: args.username,
                image: args.image,
                clerkId: args.clerkId,
            });

        }
    },
});

export const remove = internalMutation({
    args: {clerkId: v.string()},
    handler: async (ctx, {clerkId}) => {
        const user = await getUserbyClerkId(ctx, clerkId);

        if (user) {
            await ctx.db.delete(user._id);
        }
    },
});

export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity){
        return null;
    }
    return await getUserbyClerkId(ctx, identity.subject);
}

const getUserbyClerkId = async (ctx: QueryCtx | MutationCtx, clerkId: string) => {
    return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
};