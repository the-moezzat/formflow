import { database, eq } from '@repo/database';
import { team } from '@repo/database/schema';

export default async function Page({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  const teams = await database.select().from(team).where(eq(team.id, teamId));


  return <div>{teams[0].name}</div>;
}
