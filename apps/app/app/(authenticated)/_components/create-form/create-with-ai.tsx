'use client';

import PromptArea from '@/app/generate/_components/prompt-area';
import { usePromptStore } from '@/app/generate/_features/prompt-store';
import { Button } from '@repo/design-system/components/ui/button';

const EXAMPLES = [
  {
    title: '📈 Marketing Campaign Signup',
    description: 'Grow your audience and capture leads.',
    prompt:
      'Generate a marketing campaign signup form to collect names, emails, and interests for a new product launch.',
  },
  {
    title: '🤝 Sales Lead Qualification Form',
    description: 'Identify and qualify top prospects.',
    prompt:
      'Create a sales lead qualification form that asks for company name, contact info, budget, and purchase timeline.',
  },
  {
    title: '🧑‍💻 UX Research Survey',
    description: 'Gather quick user insights.',
    prompt:
      'Build a UX research survey to gather user feedback on a mobile app, including usability and feature requests.',
  },
  {
    title: '📝 Customer Satisfaction Survey',
    description: 'Measure customer happiness fast.',
    prompt:
      'Make a customer satisfaction survey with a 1-5 rating scale and a comment box for suggestions.',
  },
  {
    title: '🎯 Product Feedback Form',
    description: 'Collect feedback on new features.',
    prompt:
      'Design a product feedback form to ask users about their experience with a new feature and suggestions for improvement.',
  },
  {
    title: '🎉 Event Registration & Preferences',
    description: 'Easy RSVP and guest preferences.',
    prompt:
      'Generate an event registration form that collects attendee names, emails, and meal preferences.',
  },
  {
    title: '🧪 Exam Quiz Generator',
    description: 'Create quizzes for students.',
    prompt:
      'Create a 10-question multiple choice quiz for a high school biology exam.',
  },
  {
    title: '🛒 Abandoned Cart Recovery Survey',
    description: "Find out why users didn't buy.",
    prompt:
      'Build a short survey to ask users why they abandoned their shopping cart and what would help them complete the purchase.',
  },
];

export default function CreateWithAI() {
  const setCurrentPrompt = usePromptStore((state) => state.setCurrentPrompt);

  return (
    <div className="relative flex h-full w-full flex-col gap-6">
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-800 text-lg">Create with AI</h3>
        <p className="text-gray-600">
          Let AI generate a form for you based on your requirements.
        </p>
      </div>

      <div className="mt-auto w-full space-y-6">
        <div className="flex w-full gap-2 overflow-auto">
          {EXAMPLES.map((example, idx) => (
            <Button
              key={idx}
              variant="outline"
              className=" h-auto min-w-64 items-start whitespace-normal break-words rounded-xl p-4 text-left font-normal"
              onClick={() => setCurrentPrompt(example.prompt)}
            >
              <div>
                <div className="mb-1 font-semibold">{example.title}</div>
                <div className="text-gray-500 text-sm">
                  {example.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
        <div>
          <PromptArea />
        </div>
      </div>
    </div>
  );
}
