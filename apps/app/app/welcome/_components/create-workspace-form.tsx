'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@repo/auth/client';
import AvatarUpload from '@repo/design-system/components/avatar-upload';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Workspace name must be at least 2 characters.',
  }),
  slug: z
    .string()
    .min(2, {
      message: 'Handle must be at least 2 characters.',
    })
    .regex(/^[a-z0-9-]+$/, {
      message:
        'Handle can only contain lowercase letters, numbers, and hyphens.',
    }),
});

function CreateWorkspaceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { error: errorSlug } = await authClient.organization.checkSlug({
        slug: values.slug,
      });

      if (errorSlug) {
        form.setError(
          'slug',
          { message: 'This handle is taken' },
          { shouldFocus: true }
        );

        return;
      }

      const { data, error } = await authClient.organization.create({
        name: values.name,
        slug: values.slug,
      });

      if (error) {
        throw error;
      }

      await authClient.organization.setActive({
        organizationId: data.id,
      });

      toast.success('Workspace created', {
        description: `Successfully created workspace: ${values.name}`,
      });

      router.push('/welcome/invite-team');

      form.reset();
    } catch (error) {
      const err = error as {
        code?: string | undefined;
        message?: string | undefined;
        status: number;
        statusText: string;
      };

      toast.error('Failed to create workspace. Please try again.', {
        description: `Error: ${err.statusText}`,
      });
      console.error('Error creating workspace:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    form.setValue('slug', slug);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <AvatarUpload />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Workspace Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Inc."
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleNameChange(e);
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Workspace Handle</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="peer ps-[138px] placeholder:text-gray-500"
                    placeholder="my-workspace"
                    {...field}
                  />
                  <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground text-sm peer-disabled:opacity-50">
                    app.formflowai.me/
                  </span>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="mt-4">
          {isSubmitting ? 'Creating...' : 'Create Workspace'}
        </Button>
      </form>
    </Form>
  );
}

export default CreateWorkspaceForm;