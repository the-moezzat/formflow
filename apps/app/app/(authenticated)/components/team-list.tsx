'use client';

import { authClient } from '@repo/auth/client';
import type { InferSelectModel } from '@repo/database';
import type { team } from '@repo/database/schema';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@repo/design-system/components/ui/dropdown-menu';
import { SidebarMenuAction } from '@repo/design-system/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@repo/design-system/components/ui/sidebar';
import { SidebarMenuItem } from '@repo/design-system/components/ui/sidebar';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import {
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import {
  Icon,
  type IconName,
} from '@repo/design-system/components/ui/icon-picker';

type Team = InferSelectModel<typeof team>;

export default function TeamList() {
  const { data: activeOrganization } = authClient.useActiveOrganization();

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
    <div>
      {data?.map((team) => (
        <SidebarMenuItem key={team.name}>
          <SidebarMenuButton asChild>
            <Link href={`/team/${team.id}`}>
              {/* <FrameIcon /> */}
              <Icon name={(team.icon as IconName) ?? 'circle-dashed'} />
              <span>{team.name}</span>
            </Link>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover>
                <MoreHorizontalIcon />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" side="bottom" align="end">
              <DropdownMenuItem>
                <FolderIcon className="text-muted-foreground" />
                <span>View Team</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShareIcon className="text-muted-foreground" />
                <span>Share Team</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Trash2Icon className="text-muted-foreground" />
                <span>Delete Team</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ))}
    </div>
  );
}
