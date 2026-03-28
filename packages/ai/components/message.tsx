import type { UIMessage } from 'ai';
import type { ComponentProps } from 'react';
import Markdown from 'react-markdown';
import { twMerge } from 'tailwind-merge';

type MessageProps = {
  data: UIMessage;
  markdown?: ComponentProps<typeof Markdown>;
};

function textFromUiMessage(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: 'text'; text: string } => part.type === 'text'
    )
    .map((part) => part.text)
    .join('');
}

export const Message = ({ data, markdown }: MessageProps) => (
  <div
    className={twMerge(
      'flex max-w-[80%] flex-col gap-2 rounded-xl px-4 py-2',
      data.role === 'user'
        ? 'self-end bg-background text-foreground dark:bg-foregroundd dark:text-background'
        : 'self-start bg-muted'
    )}
  >
    <Markdown {...markdown}>{textFromUiMessage(data)}</Markdown>
  </div>
);
