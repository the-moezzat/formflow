import { database, eq } from '@repo/database';
import { team } from '@repo/database/schema';

export default async function Page({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  console.log(teamId);

  const teams = await database.select().from(team).where(eq(team.id, teamId));

  console.log(teams);

  return <div>{teams[0].name}</div>;
}
