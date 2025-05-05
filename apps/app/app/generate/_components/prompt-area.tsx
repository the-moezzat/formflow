'use client';
import { testCompression } from '@/utils/formEncoder';
import { Button } from '@repo/design-system/components/ui/button';
import { GlowEffect } from '@repo/design-system/components/ui/glow-effect';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { log } from '@repo/observability/log';
import { useActionState } from 'react';
import { useEffect, useState } from 'react';
import generateForm from '../_actions/generate-form';
import { usePromptStore } from '../_features/prompt-store';

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
  const [promptValue, setPromptValue] = useState('');
  const currentPrompt = usePromptStore((state) => state.currentPrompt);

  useEffect(() => {
    if (currentPrompt) {
      setPromptValue(currentPrompt);
    }
  }, [currentPrompt]);

  log.debug('Results', state.result);

  testCompression(state.result);

  const handleSubmit = (formData: FormData) => {
    // Set the form data value for 'prompt' to our state value
    formData.set('prompt', promptValue);
    action(formData);
  };

  return (
    <form action={handleSubmit} className="relative">
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
          value={promptValue}
          onChange={(e) => setPromptValue(e.target.value)}
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
