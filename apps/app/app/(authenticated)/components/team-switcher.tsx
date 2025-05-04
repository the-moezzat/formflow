'use client';
import { ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@repo/design-system/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { authClient } from '@repo/auth/client';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@repo/design-system/components/ui/avatar';
import CreateOrgForm from './create-org-form';

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={activeOrganization?.logo || ''}
                    alt={activeOrganization?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {activeOrganization?.name
                      .split(' ')
                      .reduce((prev, curr) => prev + curr[0], '')}
                  </AvatarFallback>
                </Avatar>{' '}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeOrganization?.name}
                  </span>
                  <span className="truncate text-xs">free plan</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {organizations?.length ? (
                organizations?.map((org, index) => (
                  <DropdownMenuItem
                    key={org.name}
                    onClick={async () =>
                      await authClient.organization.setActive({
                        organizationId: org.id,
                      })
                    }
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={org.logo || ''} alt={org?.name} />
                        <AvatarFallback className="rounded-lg">
                          {org?.name
                            .split(' ')
                            .reduce((prev, curr) => prev + curr[0], '')}
                        </AvatarFallback>
                      </Avatar>{' '}
                    </div>
                    {org.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))
              ) : (
                <p className="text-center text-gray-600 text-sm">
                  You don&apos;t have any organizations.
                </p>
              )}
              <DropdownMenuSeparator />

              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Create Organization
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to your account
              </DialogDescription>
            </DialogHeader>
            <CreateOrgForm />
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
