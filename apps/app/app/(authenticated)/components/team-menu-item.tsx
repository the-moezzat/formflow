'use client';

import { authClient } from '@repo/auth/client';
import type { InferSelectModel } from '@repo/database';
import type { team } from '@repo/database/schema';
import { DialogTrigger } from '@repo/design-system/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import {
  Icon,
  type IconName,
} from '@repo/design-system/components/ui/icon-picker';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/design-system/components/ui/sidebar';
import { useQueryClient } from '@tanstack/react-query';
import {
  FolderIcon,
  MoreHorizontalIcon,
  PencilIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useUpdateTeamStore } from '../_store/use-update-team-store';

type Team = InferSelectModel<typeof team>;

interface TeamMenuItemProps {
  team: Team;
  organizationId?: string;
}

export function TeamMenuItem({ team, organizationId }: TeamMenuItemProps) {
  const queryClient = useQueryClient();
  const { setIsOpen, setTeam } = useUpdateTeamStore();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/team/${team.id}`}>
          {/* <FrameIcon /> */}
          <Icon name={(team.icon as IconName) ?? 'circle-dashed'} />
          <span>{team.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48" side="bottom" align="end">
          <DropdownMenuItem asChild>
            <Link href={`/team/${team.id}`}>
              <FolderIcon className="text-muted-foreground" />
              <span>View Team</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              toast.info('Share team functionality coming soon');
            }}
          >
            <ShareIcon className="text-muted-foreground" />
            <span>Share Team</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(true);
                setTeam(team);
              }}
            >
              <PencilIcon className="text-muted-foreground" />
              <span>Edit Team</span>
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem
            onClick={async () => {
              await authClient.organization.removeTeam(
                {
                  teamId: team.id,
                  organizationId: organizationId,
                },
                {
                  onRequest: () => {
                    const currentTeams =
                      queryClient.getQueryData<Team[]>([
                        'teams',
                        organizationId,
                      ]) || [];

                    const newTeams = currentTeams.filter(
                      (t) => t.id !== team.id
                    );

                    queryClient.setQueryData<Team[]>(
                      ['teams', organizationId],
                      newTeams
                    );
                  },
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: ['teams', organizationId],
                    });
                  },
                  onError: (error) => {
                    toast.error(error.error.message);
                    queryClient.invalidateQueries({
                      queryKey: ['teams', organizationId],
                    });
                  },
                }
              );
            }}
          >
            <Trash2Icon className="text-muted-foreground" />
            <span>Delete Team</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
