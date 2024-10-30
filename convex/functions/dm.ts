import { v } from "convex/values";
import { authenticatedMutation } from "./helpers";

export const create = authenticatedMutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    //db - database fxnality, ctx - convex attributes
    const [user, directMessageForCurrentUser] = await Promise.all([
      ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .unique(),
      ctx.db
        .query("directMessageMembers")
        .withIndex("by_user", (q) => q.eq("user", ctx.user._id))
        .collect(),
    ]);
    if (!user) {
      throw new Error("User not found");
    }

    const matches = await Promise.all(
      directMessageForCurrentUser.map(async (dm) => {
        const member = await ctx.db
          .query("directMessageMembers")
          .withIndex("by_direct_message_user", (q) =>
            q.eq("directMessage", dm.directMessage).eq("user", user._id)
          )
          .unique();
        if (member) {
          return member.directMessage;
        }
      })
    );

    const existingDirectMessages = matches.find((m) => {
      return m != undefined;
    });
    if (existingDirectMessages) {
      return existingDirectMessages;
    }
    const directMessage = await ctx.db.insert("directMessages", {});

    await ctx.db.insert("directMessageMembers", {
      user: ctx.user._id,
      directMessage,
    });

    await ctx.db.insert("directMessageMembers", {
      user: user._id,
      directMessage,
    });
    return directMessage;
  },
});
