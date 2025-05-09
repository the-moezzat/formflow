import { z } from "zod";

export const createTeamSchema = z.object({
  teamName: z.string().min(1),
  icon: z.string().min(1).optional(), // TODO: validate against allowed icon names
});
