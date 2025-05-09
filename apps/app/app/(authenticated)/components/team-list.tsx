'use client';

import { authClient } from '@repo/auth/client';
import type { InferSelectModel } from '@repo/database';
import type { team } from '@repo/database/schema';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { TeamMenuItem } from './team-menu-item';
import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogDescription,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { UpdateTeamForm } from './update-team-form';
import { useUpdateTeamStore } from '../_store/use-update-team-store';

type Team = InferSelectModel<typeof team>;

export default function TeamList() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { isOpen, team, setIsOpen, reset } = useUpdateTeamStore();

  const { data, isLoading } = useQuery<Team[]>({
    queryKey: ['teams', activeOrganization?.id],
    queryFn: async () => {
      const { data } = await authClient.organization.listTeams();
      return (data ?? []) as Team[];
    },
  });

  if (isLoading) {
    return (
      <div>
        {[...new Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className="mb-2 h-6 w-full rounded-md bg-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div>
        {data?.map((team) => (
          <TeamMenuItem
            key={team.id}
            team={team}
            organizationId={activeOrganization?.id}
          />
        ))}
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Add a new organization to your account
          </DialogDescription>
        </DialogHeader>
        <UpdateTeamForm
          team={team}
          onClose={() => {
            setIsOpen(false);
            reset();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
