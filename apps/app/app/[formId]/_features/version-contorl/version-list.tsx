import { decodeJsonData } from '@/utils/formEncoder';
import { database, eq } from '@repo/database';
import { form } from '@repo/database/schema';
import { Badge } from '@repo/design-system/components/ui/badge';
import type { GeneratedForm } from '@repo/schema-types/types';
import { GitCommitVertical } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';

async function VersionList({ formId }: { formId: string }) {
  const [{ formHistory, encodedform }] = await database
    .select({
      formHistory: form.formHistory,
      encodedform: form.encodedForm,
    })
    .from(form)
    .where(eq(form.id, formId));

  const formMetadata = [...(formHistory as string[]), encodedform]
    ?.map(getFormMetadata)
    .sort((a, b) => {
      if (!a.updatedAt || !b.updatedAt) return 0;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <ScrollArea className=" h-96 ">
      <div className="flex flex-col gap-2 overflow-auto">
        {formMetadata?.map((metadata, idx) => (
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl border p-2 text-neutral-600 transition-colors hover:bg-neutral-200"
            key={metadata.encodedForm}
          >
            <GitCommitVertical />

            <span>
              {metadata.updatedAt
                ? formatDateWithCustomStyle(new Date(metadata.updatedAt))
                : 'No date'}
            </span>

            {idx === 0 && (
              <Badge variant="default" className="ml-auto">
                Current
              </Badge>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default VersionList;

function getFormMetadata(encodedForm: string) {
  const form = decodeJsonData<GeneratedForm>(encodedForm);

  return { encodedForm, updatedAt: form.metadata?.updatedAt };
}

function formatDateWithCustomStyle(date: Date): string {
  const formattedDate = format(date, "MMM d yyyy 'at' h:mm a");

  // Replace the AM/PM part with uppercase version
  return formattedDate.replace(/ (am|pm)$/i, (match) => match.toUpperCase());
}
