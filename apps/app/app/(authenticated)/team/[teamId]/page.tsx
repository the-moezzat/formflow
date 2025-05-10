import { database, eq } from '@repo/database';
import { form, team } from '@repo/database/schema';
import AvatarStack from './_components/avatar-stack';
import { Icon } from '@repo/design-system/components/ui/icon-picker';
import type { IconName } from '@repo/design-system/components/ui/icon-picker';
import { Header } from '../../components/header';
import { Button } from '@repo/design-system/components/ui/button';
import { Plus } from 'lucide-react';
import { FormCard } from '../../components/form-card';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@repo/auth/server';
import { Suspense } from 'react';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
export default async function Page({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(), // from next/headers
  });

  if (!session?.user) {
    return redirect('/sign-in');
  }

  const { teamId } = await params;
  const teams = await database.select().from(team).where(eq(team.id, teamId));

  const forms = await database
    .select()
    .from(form)
    .where(eq(form.userId, session.user.id));

  return (
    <div className="space-y-6 px-8 py-4">
      <Header pages={['home', 'team']} page={teams[0].name}>
        <div className="flex items-center gap-2">
          <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
            <AvatarStack />
          </Suspense>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-dashed"
          >
            <Plus />
          </Button>
        </div>
      </Header>

      <div className=" flex flex-col">
        <div className="-mb-8 h-44 w-full rounded-xl bg-gradient-to-r from-blue-300 to-blue-400" />
        <Icon
          name={teams[0].icon as IconName}
          className="ml-4 size-16 rounded-xl bg-white p-2 text-gray-700"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-gray-800">{teams[0].name}</h1>
      </div>

      <section className="space-y-4">
        <h2 className="font-medium text-gray-700 text-lg">Recent forms</h2>

        <div className="flex flex-wrap items-stretch gap-4">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      </section>
    </div>
  );
}
