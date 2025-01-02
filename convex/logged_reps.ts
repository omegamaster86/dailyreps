import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const logReps = mutation({
  args: {
    workoutId: v.string(),
    reps: v.number(),
  },
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity()
    if(!auth) {
      throw new Error("Not authorized")
    }

    // First check that the user can access the workout
    const wo = await ctx.db.query("workouts")
      .filter(q => q.and(
        q.eq(q.field("userId"), auth?.subject),
        q.eq(q.field("_id"), args.workoutId)
      )).first();

    if(wo) {
      await ctx.db.insert("logged_reps", {
        workoutId: args.workoutId,
        reps: args.reps,
        timestamp: Date.now()
      })
    }
  }
})