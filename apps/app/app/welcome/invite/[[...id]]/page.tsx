import { auth } from '@repo/auth/server';
import { database, eq } from '@repo/database';
import { organization, user } from '@repo/database/schema';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { Button } from '@repo/design-system/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Balancer from 'react-wrap-balancer';
import AcceptInvitationButton from './_components/accept-invitation-button';
import RejectInvitationButton from './_components/reject-invitaiton-button';

// Type for API errors
interface ApiError {
  statusCode: number;
  message?: string;
}

// Type guard to check if the error is an API error
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof (error as ApiError).statusCode === 'number'
  );
}

export default async function Page({
  params,
}: { params: Promise<{ id: string[] }> }) {
  const { id } = await params;

  if (!id) {
    return redirect('/');
  }

  try {
    const response = await auth.api.getInvitation({
      query: {
        id: id[0],
      },
      headers: await headers(),
    });

    const [inviter] = await database
      .select()
      .from(user)
      .where(eq(user.id, response.inviterId));

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const [org] = await database
      .select()
      .from(organization)
      .where(eq(organization.id, response.organizationId));

    return (
      <div className="flex w-[500px] flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="-space-x-7 flex items-center gap-2">
            <Avatar className="size-14 text-xl">
              <AvatarImage src={inviter.image ?? undefined} />
              <AvatarFallback className="bg-blue-100">
                {inviter.name.split(' ').reduce((acc, curr) => {
                  return acc + curr[0];
                }, '')}
              </AvatarFallback>
            </Avatar>
            <Avatar className="size-14 text-xl">
              <AvatarImage src={session?.user?.image ?? undefined} />
              <AvatarFallback>
                {inviter.name.split(' ').reduce((acc, curr) => {
                  return acc + curr[0];
                }, '')}
              </AvatarFallback>
            </Avatar>
          </div>

          <ArrowRight className="size-5 text-gray-600" />

          <Avatar className="size-14 text-xl">
            <AvatarImage src={org.logo ?? undefined} />
            <AvatarFallback>
              {org.name.split(' ').reduce((acc, curr) => {
                return acc + curr[0].toUpperCase();
              }, '')}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-2 text-center">
          <Balancer className="font-semibold text-xl">
            {inviter.name}
            <span className="text-muted-foreground">
              {' '}
              has invited you to join{' '}
            </span>
            {org.name}
          </Balancer>
          <p className="text-muted-foreground text-sm">
            You have been invited to join a team on Formflow.
          </p>
        </div>
        <div className="flex w-full items-center gap-2">
          <RejectInvitationButton invitationId={id[0]} />
          <AcceptInvitationButton invitationId={id[0]} />
        </div>
      </div>
    );
  } catch (error) {
    // Check if error is an API error before accessing properties
    if (isApiError(error)) {
      if (error.statusCode === 401) {
        redirect(`/sign-in?redirect=/welcome/invite/${id[0]}`);
      }

      if (error.statusCode === 403) {
        return (
          <div className="flex w-[500px] flex-col items-center gap-8">
            <div className="flex items-center gap-2 rounded-full bg-red-100 p-4">
              <Image
                src="/pictogram/error.svg"
                alt="Invite team"
                width={70}
                height={70}
              />
            </div>

            <div className="space-y-2 text-center">
              <Balancer className="text-center font-semibold text-xl">
                Oops! This invitation was meant for a different account
              </Balancer>
              <p className="text-muted-foreground text-sm">
                Please contact the team owner to accept this invitation.
              </p>
            </div>

            <Button asChild>
              <Link href="/">Back to dashboard</Link>
            </Button>
          </div>
        );
      }

      if (error.statusCode === 400) {
        return (
          <div className="flex w-[500px] flex-col items-center gap-8">
            <div className="flex items-center gap-2 rounded-full bg-red-50 p-2">
              <Image
                src="/pictogram/error.svg"
                alt="Invite team"
                width={60}
                height={60}
              />
            </div>

            <div className="space-y-2 text-center">
              <Balancer className="text-center font-semibold text-xl">
                This invitation link is no longer valid
              </Balancer>
              <p className="text-muted-foreground text-sm">
                This could be because the invitation has already been accepted,
                expired, or was cancelled. Please ask the team owner to send you
                a new invitation if you still need access.
              </p>
            </div>

            <Button asChild>
              <Link href="/">Back to dashboard</Link>
            </Button>
          </div>
        );
      }
    }
  }
}
