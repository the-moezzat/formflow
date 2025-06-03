import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@repo/design-system/components/ui/sidebar';
import {
  AnchorIcon,
  AudioWaveform,
  ChevronRightIcon,
  Command,
  FrameIcon,
  GalleryVerticalEnd,
  HomeIcon,
  LifeBuoyIcon,
  MapIcon,
  PieChartIcon,
  SendIcon,
  Settings2Icon,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CreateTeamDialog } from '../../components/create-team-dialog';
import { NavUser } from '../../components/nav-user';
import TeamList from '../../components/team-list';
import { TeamSwitcher } from '../../components/team-switcher';
import CreateFormModel from '../create-form/create-form-model';

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings2Icon,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Webhooks',
      url: '/webhooks',
      icon: AnchorIcon,
    },
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoyIcon,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: SendIcon,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: FrameIcon,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChartIcon,
    },
    {
      name: 'Travel',
      url: '#',
      icon: MapIcon,
    },
  ],
};

export const GlobalSidebar = async ({ children }: GlobalSidebarProperties) => {
  // const teams = await auth.api.listOrganizationTeams({
  //   headers: await headers(),
  // });

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader className="mb-2">
          <TeamSwitcher />
          <CreateFormModel />
          {/* <Button asChild>
            <Link href="/generate">
              <Plus /> Craft next form
            </Link>
          </Button> */}
        </SidebarHeader>

        {/* <Search /> */}
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <HomeIcon /> Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between">
              <SidebarGroupLabel>Teams</SidebarGroupLabel>
              <CreateTeamDialog />
            </div>

            <SidebarMenu>
              <TeamList />

              {/* <SidebarMenuItem>
                <SidebarMenuButton>
                  <MoreHorizontalIcon />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible key={item.title} asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRightIcon />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />

          {/* <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <div className="flex shrink-0 items-center gap-px">
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  asChild
                >
                  <div className="h-4 w-4">
                    <NotificationsTrigger />
                  </div>
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu> */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="">{children}</SidebarInset>
    </>
  );
};
