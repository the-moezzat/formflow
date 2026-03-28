'use client';

import { DefaultChatTransport } from '@repo/ai';
import { Message } from '@repo/ai/components/message';
import { Thread } from '@repo/ai/components/thread';
import { useChat } from '@repo/ai/lib/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { handleError } from '@repo/design-system/lib/utils';
import { SendIcon } from 'lucide-react';
import { type FormEvent, useState } from 'react';

export const Chatbot = ({
  formResponse,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { formResponse: Record<string, any>[] }) => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    onError: (error) => handleError(error),
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { formResponse: JSON.stringify(formResponse) },
    }),
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) {
      return;
    }
    sendMessage({ text }).catch((err) => handleError(err));
    setInput('');
  };

  return (
    <div className="flex h-full flex-col divide-y overflow-hidden">
      <Thread>
        {messages.map((message) => (
          <Message key={message.id} data={message} />
        ))}
      </Thread>
      <form
        onSubmit={onSubmit}
        className="mt-auto flex shrink-0 items-center gap-2 px-8 py-4"
        aria-disabled={isBusy}
      >
        <Input
          placeholder="Ask a question!"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" size="icon" disabled={isBusy}>
          <SendIcon />
        </Button>
      </form>
    </div>
  );
};
