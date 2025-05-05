import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { eq } from '@repo/database';
import { form } from '@repo/database/schema';
import { Button } from '@repo/design-system/components/ui/button';
import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FormCard } from './components/form-card';

const title = 'Acme Inc';
const description = 'My application.';

// const CollaborationProvider = dynamic(() =>
//   import('./components/collaboration-provider').then(
//     (mod) => mod.CollaborationProvider
//   )
// );

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // from next/headers
  });

  if (!session?.user) {
    return redirect('/sign-in');
  }

  const forms = await database
    .select()
    .from(form)
    .where(eq(form.userId, session.user.id));

  return (
    <>
      {/* <Header pages={[]} page="Data Fetching">
        {env.LIVEBLOCKS_SECRET && (
          <CollaborationProvider orgId={orgId}>
            <AvatarStack />
            <Cursors />
          </CollaborationProvider>
        )}
      </Header> */}
      <div className="space-y-10 p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-2xl">
            Welcome, {session.user.name.split(' ')[0]}
          </h1>
          <Button asChild>
            <Link href="/generate">
              <Plus /> Create new form
            </Link>
          </Button>
        </div>

        <section className="space-y-4">
          <h2 className="font-medium text-lg">Recent forms</h2>

          <div className="flex flex-wrap items-stretch gap-4">
            {forms.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default App;
