'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Mail, MessageSquare, RefreshCcw, Settings2, User } from 'lucide-react';
import type { ReactElement } from 'react';
import { usePromptStore } from '../_features/prompt-store';

export function PromptExamples() {
  const setCurrentPrompt = usePromptStore((state) => state.setCurrentPrompt);

  return (
    <div className="space-y-2">
      <div className="mt-4 grid grid-cols-4 gap-2">
        <PromptExample
          title="SaaS Product Customer Satisfaction Survey with Ratings"
          content="Create a comprehensive customer satisfaction survey for a SaaS product with sections for ease of use, feature satisfaction, customer support experience, and likelihood to recommend. Include rating scales (1-10), multiple choice options, and at least 2 open-ended text fields for detailed feedback."
          Icon={<User size={18} />}
          onClick={setCurrentPrompt}
        />
        <PromptExample
          title="Quarterly Employee Performance Review with Goals & Skills"
          content="Design a quarterly employee performance review form with fields for goal achievement metrics (0-100%), skill assessment matrix (beginner to expert), self-evaluation section, manager feedback area, and professional development planning. Include date fields and signature verification."
          Icon={<Mail size={18} />}
          onClick={setCurrentPrompt}
        />
        <PromptExample
          title="Tech Startup Job Application with Work Experience & Skills"
          content="Build a job application form for a tech startup with sections for personal information, work experience (with ability to add multiple entries), education history, skills assessment (both technical and soft skills), portfolio links, and availability for interviews. Include file upload for resume and cover letter."
          Icon={<MessageSquare size={18} />}
          onClick={setCurrentPrompt}
        />
        <PromptExample
          title="Seed Funding Application with Metrics & Team Background"
          content="Create a funding application form for startups seeking seed investment. Include company profile (name, founding date, team size), business model explanation, current traction metrics, funding history, requested amount with budget breakdown, pitch deck upload, and founder background questions. Add a section for competitive analysis."
          Icon={<Settings2 size={18} />}
          onClick={setCurrentPrompt}
        />
      </div>
      <Button variant={'ghost'}>
        {' '}
        <RefreshCcw
          className="-ms-1 me-2 opacity-60"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />{' '}
        Refresh prompts
      </Button>
    </div>
  );
}

function PromptExample({
  title,
  content,
  Icon,
  onClick,
}: {
  title: string;
  content: string;
  Icon: ReactElement;
  onClick: (content: string) => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer flex-col justify-between gap-6 rounded-lg border p-4 text-left text-gray-700 text-sm transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-900"
      onClick={() => onClick(content)}
      aria-label={`Use prompt: ${title}`}
    >
      <p className="font-medium text-sm">{title}</p>
      {Icon}
    </button>
  );
}
