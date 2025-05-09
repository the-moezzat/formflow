import { database, eq } from "@repo/database";
import { team } from "@repo/database/schema";
import { z, type BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, createAuthMiddleware, Team } from "better-auth/plugins";

// type Team = {
//     id: string;
//     name: string;
// }

export const teamIconPlugin = () => {
    return {
        id: "team-icon-plugin",
        hooks: {
            // before: [{
            //     matcher: (context) => {
            //         return context.path === "/organization/create-team";
            //     },
            //     handler: createAuthMiddleware(async (ctx) => {
            //         //do something before the request
            //         console.log("ctx", ctx);
            //         return {
            //             context: ctx, // if you want to modify the context
            //         };
            //     }),
            // }],
            after: [{
                matcher: (context) => {
                    return context.path === "/organization/create-team";
                },
                handler: createAuthMiddleware(async (ctx) => {
                    console.log("ctx", ctx);
                   const teamCreated = ctx.context.returned as Team

                   const updatedTeam = await database.update(team).set({
                    icon: ctx.query?.icon ?? 'circle-dashed'
                   }).where(eq(team.id, teamCreated.id))

                  return updatedTeam
                }),
            }],
        },
    //         endpoints: {
    //   createTeamWithIcon: createAuthEndpoint("/organization/create-team-with-icon", {
    //     method: "POST",
    //     body:   z.object({
    //         name: z.string(),
    //         organizationId: z.string().optional(),
    //         icon_url: z.string().optional(),
    //     }),
    //   }, async (ctx) => {
    //     const { name, organizationId, icon_url } = ctx.body;
        
    //     // Call the original createTeam method from the organization plugin
    //     const organizationPlugin = ctx.context.options.plugins?.find((plugin) => plugin.id === "organization");

    //     const team = await organizationPlugin?.createTeam(ctx.context, {
    //       name,
    //       organizationId
    //     });
        
    //     // Add the icon if provided
    //     if (icon_url) {
    //       await ctx.context.db.team.update({
    //         where: { id: team.id },
    //         data: { icon_url }
    //       });
          
    //       team.icon_url = icon_url;
    //     }
        
    //     return ctx.json(team);
    //   })
    // }

        schema: {
            team: {
                fields: {
                    icon: {
                        type: "string",
                        required: false,
                        defaultValue: "circle-dashed",
                    },
                },
            },
        },
    } satisfies BetterAuthPlugin;
};
