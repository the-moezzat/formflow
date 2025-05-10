import { auth } from '@repo/auth/server';
import { database, eq } from '@repo/database';
import { member, user } from '@repo/database/schema';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { headers } from 'next/headers';

export default async function AvatarStack() {
  const session = await auth.api.getSession({
    headers: await headers(), // from next/headers
  });

  const members = await database
    .select({
      id: member.id,
      userId: member.userId,
      role: member.role,
      userName: user.name,
      userImage: user.image,
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .where(
      eq(member.organizationId, session?.session?.activeOrganizationId ?? '')
    );

  return (
    <div className="-space-x-3 flex">
      {members.map((member) => (
        <TooltipProvider key={member.id}>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Avatar className="size-8 ring-2 ring-background">
                <AvatarImage src={member.userImage ?? undefined} />
                <AvatarFallback>
                  {member.userName?.split(' ').reduce((acc, char) => {
                    return acc + char[0].toUpperCase();
                  }, '')}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.userName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {members.length > 3 && (
        <Button
          variant="secondary"
          className="z-10 flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground text-xs ring-2 ring-background hover:bg-secondary hover:text-foreground"
          size="icon"
        >
          +{members.length - 3}
        </Button>
      )}
    </div>
  );
}
