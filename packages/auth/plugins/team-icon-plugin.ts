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
            }, {
                matcher: (context) => {
                    return context.path === "/organization/update-team";
                },
                handler: createAuthMiddleware(async (ctx) => {
                    const teamUpdated = ctx.context.returned as Team

                    const updatedTeam = await database.update(team).set({
                        icon: ctx.query?.icon ?? 'circle-dashed'
                    }).where(eq(team.id, teamUpdated.id))

                    return updatedTeam
                }),
            }],
        },
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
