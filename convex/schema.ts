import {defineSchema, defineTable } from "convex/server";
import { v } from "convex/values"

//We're using these complex seeming functions to fetch friend requests that might be pending
//we need both statuses, why? user 1 is sending the request, user 2 is receiving the request
export default defineSchema({
    users: defineTable({
        username: v.string(),
        image: v.string(),
        clerkId: v.string(),
    }).index("by_clerk_id", ["clerkId"]).index("by_username", ["username"]),
        friends: defineTable ({
            user1: v.id("users"),
            user2: v.id("users"),
            status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
        }).index("by_user1_status", ["user1", "status"]).index("by_user2_status", ["user2", "status"]),


        messages: defineTable({
        sender: v.string(),
        content: v.string(),
    }),
});