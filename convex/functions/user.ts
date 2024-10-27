import { internalMutation } from "../_generated/server";
//Can't call from frontend, will call from http action
//or from another function within Convex API
import { v} from "convex/values";

export const upsert = internalMutation({
    args: {
        username: v.string(),
        image: v.string(),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users")
        .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
        .unique();

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
        const user = await ctx.db.query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();

        if (user) {
            await ctx.db.delete(user._id);
        }
    },
});