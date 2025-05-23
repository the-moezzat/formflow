'use client';
import { useFormflow } from '@/app/[formId]/_hooks/use-formflow';
import { encodeJsonData } from '@/utils/formEncoder';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/dialog-tabs';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { Input } from '@repo/design-system/components/ui/input';
import { Separator } from '@repo/design-system/components/ui/separator';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
});

function Settings() {
  // const formData = useFormData();
  const { decodedFormData: formData, updateForm: setForm } = useFormflow();
  // const [_, setform] = useQueryState('form');
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      title: formData ? formData.title : '',
      description: formData ? (formData.descriptions ?? '') : '',
    },
    mode: 'onSubmit',
  });

  // 2. Define a submit handler.
  function onSubmit({ title, description }: z.infer<typeof formSchema>) {
    const newForm = {
      ...formData,
      title,
      descriptions: description,
    };
    const decodedForm = encodeJsonData(newForm);

    setForm(decodedForm);
    setDialogOpen(false);
  }
  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={'icon'}
          className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <DialogContent className=" grid h-3/6 w-[650px] grid-rows-[auto,1fr] flex-col gap-4 bg-gray-50 dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-gray-900 text-xl dark:text-gray-200">
                Settings
              </DialogTitle>
            </DialogHeader>

            <Tabs
              defaultValue="general"
              className="grid h-full grid-cols-[auto,1fr] gap-2 overflow-auto"
            >
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="language">Language</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="overflow-auto ">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel flags={false}>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Form title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel flags={false}>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Form description"
                          className="resize-none"
                          minRows={3}
                          maxRows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator orientation="horizontal" />
              </TabsContent>

              <TabsContent value="language">Language Settings</TabsContent>
            </Tabs>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                disabled={!form.formState.isDirty}
                onClick={form.handleSubmit(onSubmit)}
                type="submit"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

export default Settings;
