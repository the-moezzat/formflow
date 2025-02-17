'use client';
import { Button } from '@repo/design-system/components/ui/button';
import { GlowEffect } from '@repo/design-system/components/ui/glow-effect';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import generateForm from '../_actions/generate-form';
import { useActionState } from 'react';
import { log } from '@repo/observability/log';
import { testCompression } from '@/utils/formEncoder';

const initialState = {
  prompt: '',
  result: {
    title: '',
    fields: [],
    descriptions: '',
    metadata: {
      createdAt: '',
      updatedAt: '',
    },
  },
};

function PromptArea() {
  const [state, action, isLoading] = useActionState(generateForm, initialState);

  log.debug('Results', state.result);

  testCompression(state.result);

  return (
    <form action={action} className="relative">
      <GlowEffect
        colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
        mode="rotate"
        blur="medium"
        scale={isLoading ? 1 : 0}
      />
      <div>
        <Textarea
          className="relative min-h-36 resize-none bg-gray-100 p-5 text-gray-900 placeholder:text-base placeholder:text-gray-600 focus:ring-0 md:text-base dark:bg-neutral-900 dark:text-white dark:placeholder:text-gray-300"
          placeholder="Ask whatever you want... "
          maxRows={10}
          name="prompt"
          required
          autoFocus
        />
        <div className="absolute right-4 bottom-4">
          <GlowEffect
            colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
            mode="static"
            blur="medium"
            duration={3}
            scale={isLoading ? 0 : 1}
          />
          <Button className="relative" type="submit">
            Start Building
          </Button>
        </div>
      </div>
    </form>
  );
}

export default PromptArea;
