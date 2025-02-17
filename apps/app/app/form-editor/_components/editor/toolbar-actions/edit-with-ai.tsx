'use client';
import { Button } from '@repo/design-system/components/ui/button';
import { WandSparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from './ai-editor-dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Input } from '@repo/design-system/components/ui/input';
import { useActionState, useEffect } from 'react';
import generateEdit from '@/app/form-editor/_actions/ai-edit';
import { useFormData } from '@/app/form-editor/_hooks/use-form-data';
import { useQueryState } from 'nuqs';

function EditWithAi() {
  const [decodedForm, setForm] = useQueryState('form');

  const initialState = {
    prompt: '',
    result: decodedForm,
  };
  const [state, action, isLoading] = useActionState(generateEdit, initialState);

  const formData = useFormData();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!state.result) {
      return;
    }
    setForm(state.result);
  }, [state.result]);

  //   console.log('state', state);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="ml-auto hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <WandSparkles />
          Edit with AI
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-4">
        <DialogTitle className="hidden">Edit with AI</DialogTitle>
        <div className="flex gap-2">
          <div className="w-fit rounded-full border px-2 py-1 text-xs">
            Add more details
          </div>
          <div className="w-fit rounded-full border px-2 py-1 text-xs">
            Add more details
          </div>
        </div>
        <form action={action} className="relative">
          <Input
            name="prompt"
            className="mt-4 rounded-full focus-visible:ring-0"
            placeholder="Type your changes to Fatten"
          />
          <Input
            name="form"
            type="hidden"
            value={JSON.stringify(formData)}
            className="mt-4 rounded-full"
            placeholder="Type your changes to Fatten"
          />
          {/* <Button type="submit" disabled={isLoading}>
            Submit
          </Button> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditWithAi;
