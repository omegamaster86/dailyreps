import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const list = query({
  args: {},
  handler: async (ctx) => {
	  // This code is what parses the Clerk user ID from the token
    const auth = await ctx.auth.getUserIdentity()
    if(!auth) {
      throw new Error("Not authorized")
    }

    // Return only workouts that match the userId 
    // that are NOT deleted
    return await ctx.db.query("workouts")
      .filter(q => q.and(
        q.eq(q.field("userId"), auth?.subject),
        q.neq(q.field("isDeleted"), true)
      ))
      .collect();
  },
});