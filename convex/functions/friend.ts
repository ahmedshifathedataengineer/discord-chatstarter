import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";

// List pending friends
export const listPending = authenticatedQuery({
  handler: async (ctx) => {
    console.log("Fetching pending friends..."); // Add log
    const friends = await ctx.db
      .query("friends")
      .withIndex("by_user2_status", (q) =>
        q.eq("user2", ctx.user._id).eq("status", "pending")
      )
      .collect();
    return await mapWithUsers(ctx, friends, "user1");
  },
});

// List accepted friends
export const listAccepted = authenticatedQuery({
  handler: async (ctx) => {
    console.log("Fetching accepted friends..."); // Add log
    const friends1 = await ctx.db
      .query("friends")
      .withIndex("by_user1_status", (q) =>
        q.eq("user1", ctx.user._id).eq("status", "accepted")
      )
      .collect();
    const friends2 = await ctx.db
      .query("friends")
      .withIndex("by_user2_status", (q) =>
        q.eq("user2", ctx.user._id).eq("status", "accepted")
      )
      .collect();
    const friendsWithUser1 = await mapWithUsers(ctx, friends1, "user2");
    const friendsWithUser2 = await mapWithUsers(ctx, friends2, "user1");
    return [...friendsWithUser1, ...friendsWithUser2];
  },
});

// Create friend request
export const createFriendRequest = authenticatedMutation({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    console.log("Received friend request for:", username);

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }
    if (user._id === ctx.user._id) {
      throw new Error("Cannot add yourself");
    }

    // Perform two separate queries to check for existing requests
    const existingRequest1 = await ctx.db
      .query("friends")
      .withIndex("by_users", (q) =>
        q.eq("user1", ctx.user._id).eq("user2", user._id)
      )
      .unique();

    const existingRequest2 = await ctx.db
      .query("friends")
      .withIndex("by_users", (q) =>
        q.eq("user1", user._id).eq("user2", ctx.user._id)
      )
      .unique();

    // Check if any of the queries returned an existing request
    if (existingRequest1 || existingRequest2) {
      throw new Error("Friend request already exists");
    }

    // Insert the new friend request if no existing request was found
    await ctx.db.insert("friends", {
      user1: ctx.user._id,
      user2: user._id,
      status: "pending",
    });

    console.log("Friend request sent successfully");
  },
});

// Update friend status
export const updateStatus = authenticatedMutation({
  args: {
    id: v.id("friends"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, { id, status }) => {
    console.log("Updating status for:", id, status);

    const friend = await ctx.db.get(id);
    if (!friend) throw new Error("Friend not found");

    if (friend.user1 !== ctx.user._id && friend.user2 !== ctx.user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { status });
    console.log("Status updated to:", status);
  },
});

// Helper function
const mapWithUsers = async <
  K extends string,
  T extends { [key in K]: Id<"users"> },
>(
  ctx: QueryCtx,
  items: T[],
  key: K
) => {
  const result = await Promise.allSettled(
    items.map(async (item) => {
      const user = await ctx.db.get(item[key]);
      if (!user) throw new Error("User not found");
      return { ...item, user };
    })
  );
  return result.filter((r) => r.status === "fulfilled").map((r) => r.value);
};
