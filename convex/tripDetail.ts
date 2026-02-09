import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTripDetail = mutation({
  args:{
    tripId:v.string(),
    uid:v.id('userTable'),
    tripDetail: v.any()
  },
  handler: async(ctx,args)=>{
      const result = await ctx.db.insert("TripDetailTable",{
        tripDetail:args.tripDetail,
        uid: args.uid,
        tripId:args.tripId
      })

      return result;
  }
})


export const GetUserTrips = query({
  args:{
    uid:v.id('userTable')
  },
  handler: async(ctx,args)=>{
    const result = await ctx.db.query("TripDetailTable").filter(q=>q.eq(q.field('uid'), args.uid)).order("desc").collect();

    return result;
  }
})



export const GetTripById= query({
  args:{
    uid:v.id('userTable'),
    tripid:v.string()
  },
  handler: async(ctx,args)=>{
    const result = await ctx.db.query("TripDetailTable").filter(q=>q.and(
      q.eq(q.field('uid'), args.uid),
      q.eq(q.field('tripId'), args.tripid),
      
    )).collect();

    return result;
  }
})



