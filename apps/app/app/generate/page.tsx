import { auth } from '@repo/auth/server';
import PromptArea from './_components/prompt-area';
import { PromptExamples } from './_components/prompt-examples';
import { headers } from 'next/headers';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="grid h-dvh w-full content-center justify-items-center">
      <div className=" w-7/12 space-y-8">
        <header className=" flex flex-col gap-4">
          <h1 className="w-fit bg-gradient-to-r from-yellow-600 to-blue-500 bg-clip-text font-bold text-4xl text-transparent">
            Hi {session ? session.user.name.split(' ')[0] : 'there'}, <br />{' '}
            What would you like to build?
          </h1>
          <p className="text-gray-600 text-lg dark:text-gray-400">
            Use one of most common prompts below or use your own to begin
          </p>
          <PromptExamples />
        </header>

        <PromptArea />
      </div>
    </div>
  );
}