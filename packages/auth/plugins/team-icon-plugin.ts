import type { BetterAuthPlugin } from "better-auth";
 
export const teamIconPlugin = ()=>{
    return {
        id: "team-icon-plugin",
        
        schema: {
            team: {
                fields: {
                    icon: {
                        type: 'string',
                        required: false,
                        defaultValue: 'circle-dashed',
                    }
                }
            }
        }
    } satisfies BetterAuthPlugin
}