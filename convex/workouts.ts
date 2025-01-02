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

export const insert = mutation({
  args: {
    name: v.string(),
    targetReps: v.number()
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity()
    if(!auth) {
      throw new Error("Not authorized")
    }

    // Use the user's ID to insert the workout into the Convex database
    return await ctx.db.insert("workouts", {
      name: args.name,
      targetReps: args.targetReps,
      userId: auth.subject
    })
  }
})