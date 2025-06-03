'use client';

import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import {
  FolderInput,
  LayoutTemplate,
  NotepadText,
  Plus,
  Sparkles,
  Unplug,
} from 'lucide-react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { cn } from '@repo/design-system/lib/utils';
import CreateBlank from './create-blank';
import type { ReactNode } from 'react';

interface SubTab {
  id: string;
  label: string;
  parentId: string;
}

interface FormCreationOption {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  isSpecial: boolean;
  isClickable: boolean;
  subTabs?: SubTab[];
  content?: ReactNode;
}

interface ClickableTab extends FormCreationOption {
  isSubTab?: boolean;
  parentOption?: FormCreationOption;
}

const formCreationOptions: FormCreationOption[] = [
  {
    id: 'ai',
    icon: Sparkles,
    label: 'Create with AI',
    isSpecial: true,
    isClickable: true,
  },
  {
    id: 'scratch',
    icon: NotepadText,
    label: 'Start from scratch',
    isSpecial: false,
    isClickable: true,
    content: <CreateBlank />,
  },
  {
    id: 'templates',
    icon: LayoutTemplate,
    label: 'Templates',
    isSpecial: false,
    isClickable: true,
  },
  {
    id: 'import',
    icon: FolderInput,
    label: 'Import from',
    isSpecial: false,
    isClickable: false, // This is just organizational
    subTabs: [
      {
        id: 'import-pdf',
        label: 'PDF',
        parentId: 'import',
      },
      {
        id: 'import-google-forms',
        label: 'Google Forms',
        parentId: 'import',
      },
    ],
  },
  {
    id: 'connect',
    icon: Unplug,
    label: 'Connect',
    isSpecial: false,
    isClickable: false, // This is just organizational
    subTabs: [
      {
        id: 'hubspot',
        label: 'Hubspot',
        parentId: 'connect',
      },
    ],
  },
];

// Flatten all clickable tabs (main tabs + sub tabs)
const getAllClickableTabs = (): ClickableTab[] => {
  const clickableTabs: ClickableTab[] = [];

  for (const option of formCreationOptions) {
    if (option.isClickable) {
      clickableTabs.push(option);
    }
    if (option.subTabs) {
      for (const subTab of option.subTabs) {
        clickableTabs.push({
          ...subTab,
          icon: option.icon,
          isSpecial: false,
          isClickable: true,
          isSubTab: true,
          parentOption: option,
        });
      }
    }
  }

  return clickableTabs;
};

export default function CreateFormModel() {
  const clickableTabs = getAllClickableTabs();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus />
          Craft next form
        </Button>
      </DialogTrigger>
      <Tabs defaultValue="ai" orientation="vertical">
        <DialogContent className="grid h-[450px] max-w-5xl grid-cols-[4fr_auto_12fr] items-center gap-0 border-none bg-transparent shadow-none">
          <div className="h-full space-y-8 rounded-xl rounded-l-2xl bg-white p-4">
            <DialogHeader>
              <DialogTitle className="text-gray-800 text-lg">
                Create your next form
              </DialogTitle>
            </DialogHeader>

            <TabsList className="flex h-fit w-full flex-col gap-2 bg-transparent p-0">
              {formCreationOptions.map((option) => {
                const Icon = option.icon;

                // Render main tab if it's clickable
                if (option.isClickable) {
                  return (
                    <TabsTrigger
                      key={option.id}
                      value={option.id}
                      className="group w-full p-0 data-[state=active]:bg-transparent data-[state=active]:text-inherit data-[state=active]:shadow-none"
                    >
                      {option.isSpecial ? (
                        <div className="group relative flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:text-white data-[state=active]:text-white">
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[rgba(237,81,60,0.86)] to-[rgba(13,166,255,0.69)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-data-[state=active]:opacity-100" />
                          <Icon
                            size={16}
                            className="relative fill-primary text-primary group-hover:fill-white group-hover:text-white group-data-[state=active]:fill-white group-data-[state=active]:text-white"
                          />
                          <p className="relative text-gray-700 group-hover:text-white group-data-[state=active]:text-white">
                            {option.label}
                          </p>
                        </div>
                      ) : (
                        <div className="flex w-full items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-gray-100 group-data-[state=active]:bg-gray-100">
                          <Icon size={16} className="text-gray-600" />
                          <p className="text-gray-700">{option.label}</p>
                        </div>
                      )}
                    </TabsTrigger>
                  );
                }

                // Render organizational tab with sub-tabs
                if (option.subTabs) {
                  return (
                    <div
                      className="flex w-full items-baseline gap-2 rounded-lg px-2 py-2"
                      key={option.id}
                    >
                      <Icon size={16} className="text-gray-600 " />
                      <div className="w-full">
                        <p className="text-gray-700">{option.label}</p>

                        <div
                          className={cn(
                            'relative flex w-full flex-col transition-colors before:absolute before:top-0 before:left-0 before:h-3/6 before:border-border before:border-l',
                            {
                              'before:h-0': option.subTabs.length < 2,
                              'before:h-3/6': option.subTabs.length === 2,
                              'before:h-5/6': option.subTabs.length > 2,
                            }
                          )}
                        >
                          {option.subTabs.map((subTab) => (
                            <TabsTrigger
                              key={subTab.id}
                              value={subTab.id}
                              className="group w-full items-start p-0 data-[state=active]:bg-transparent data-[state=active]:text-inherit data-[state=active]:shadow-none"
                              asChild
                            >
                              <div className="flex w-full items-baseline gap-1 self-start">
                                <>
                                  <span className="inline-block h-6 w-4 rounded-bl-xl border-b border-l" />
                                  <span className="block w-full rounded-lg px-2 py-1 text-gray-600 text-sm transition-colors hover:bg-gray-100 group-data-[state=active]:bg-gray-100">
                                    {subTab.label}
                                  </span>
                                </>
                              </div>
                            </TabsTrigger>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </TabsList>
          </div>

          <div className="before:-translate-y-full before:-translate-x-1/2 after:-translate-x-1/2 -z-10 relative h-[95%] w-2 scale-x-105 bg-white before:absolute before:top-[0px] before:left-1/2 before:h-2 before:w-[10px] before:rounded-b-full before:bg-transparent before:shadow-[0_6px_0_1px_rgba(255,255,255)] before:content-[''] after:absolute after:bottom-[0px] after:left-1/2 after:h-2 after:w-[10px] after:translate-y-full after:rounded-t-full after:bg-transparent after:shadow-[0_-6px_0_1px_rgba(255,255,255)] after:content-['']">
            <div className=" absolute right-1/2 z-10 h-full translate-x-1/2 border-r border-dashed " />
          </div>

          <div className="h-full rounded-xl rounded-r-2xl bg-white">
            {clickableTabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="mt-0 h-full p-4 px-4"
              >
                {tab.content || (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {tab.isSubTab && tab.parentOption
                        ? `${tab.parentOption.label} - ${tab.label}`
                        : tab.label}
                    </h3>
                    <p className="text-gray-600">
                      {tab.id === 'ai' &&
                        'Generate forms instantly with AI assistance. Describe what you need and watch your form come to life.'}
                      {tab.id === 'scratch' &&
                        'Start with a blank canvas and build your form from the ground up with full creative control.'}
                      {tab.id === 'templates' &&
                        'Choose from our collection of professionally designed form templates to get started quickly.'}
                      {tab.id === 'import-pdf' &&
                        'Import form fields and structure from PDF documents to quickly recreate existing forms.'}
                      {tab.id === 'import-google-forms' &&
                        'Import your existing Google Forms to continue working with familiar form structures.'}
                    </p>
                    {/* Placeholder for form content specific to each tab */}
                    <div className="rounded-lg border-2 border-gray-200 border-dashed p-8 text-center">
                      <p className="text-gray-500">
                        {tab.isSubTab && tab.parentOption
                          ? `${tab.parentOption.label} - ${tab.label}`
                          : tab.label}{' '}
                        form builder will be implemented here
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </div>
        </DialogContent>
      </Tabs>
    </Dialog>
  );
}
