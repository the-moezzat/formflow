import { z } from "zod";

export const updateTeamSchema = z.object({
  teamId: z.string().min(1),
  teamName: z.string().min(1),
  icon: z.string().min(1), // TODO: validate against allowed icon names
}); 