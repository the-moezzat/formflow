'use client';

import { Message } from '@repo/ai/components/message';
import { Thread } from '@repo/ai/components/thread';
import { useChat } from '@repo/ai/lib/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { handleError } from '@repo/design-system/lib/utils';
import { SendIcon } from 'lucide-react';

export const Chatbot = ({
  formResponse,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { formResponse: Record<string, any>[] }) => {
  const { messages, input, handleInputChange, isLoading, handleSubmit } =
    useChat({
      onError: handleError,
      api: '/api/chat',
      body: { formResponse: JSON.stringify(formResponse) },
    });

  return (
    <div className="flex h-full flex-col divide-y overflow-hidden">
      <Thread>
        {messages.map((message) => (
          <Message key={message.id} data={message} />
        ))}
      </Thread>
      <form
        onSubmit={handleSubmit}
        className="mt-auto flex shrink-0 items-center gap-2 px-8 py-4"
        aria-disabled={isLoading}
      >
        <Input
          placeholder="Ask a question!"
          value={input}
          onChange={handleInputChange}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <SendIcon />
        </Button>
      </form>
    </div>
  );
};
