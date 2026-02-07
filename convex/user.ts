import { v } from "convex/values";
import { mutation } from "./_generated/server";


//  * This function will be allowed to modify your Convex database. It will not be accessible from the client.
export const  createNewUser = mutation({
  args:{
    name:v.string(),
    email:v.string(),
    imageUrl:v.string()
  },
  handler: async (ctx, args)=>{
    const user = await  ctx.db.query("userTable").filter((q)=>q.eq(q.field("email"), args.email)).collect();


    //user not exist
    if(user?.length ==0){
      const userData = {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl
      }

      //create user
      const result = await ctx.db.insert("userTable",userData);
      return result[0];
    }

    return user[0];
  }

})