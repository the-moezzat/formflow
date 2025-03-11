import { useQuery } from '@tanstack/react-query';
import { loadVersions } from '../../_actions/version-control';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { GitCommitVertical, LoaderCircle } from 'lucide-react';
import { useVersionHistoryStore } from './store';
import { cn } from '@repo/design-system/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@repo/design-system/components/ui/badge';

function Versions({ formId }: { formId: string }) {
  const { data: versions, isLoading } = useQuery({
    queryKey: ['form-versions', formId],
    queryFn: async () => await loadVersions({ formId }),
  });

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-accent p-4">
      <h3 className="text-neutral-700">Recently published versions</h3>
      <ScrollArea className=" h-64 ">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoaderCircle
              className=" animate-spin text-neutral-700 dark:text-neutral-200"
              size={16}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-auto">
            {versions?.map((version) => (
              <VersionItem version={version} key={version.encodedForm} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default Versions;

function VersionItem({
  version,
}: {
  version: {
    encodedForm: string;
    updatedAt: string;
    versionIndex: number;
    current: boolean;
  };
}) {
  const { selectedVersion, setSelectedVersion } = useVersionHistoryStore();

  return (
    <button
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-xl border p-2 text-neutral-600 transition-colors hover:bg-neutral-200',
        {
          'bg-neutral-200': selectedVersion === version.versionIndex,
        }
      )}
      key={version.encodedForm}
      type="button"
      onClick={() => {
        if (version.current) {
          return;
        }
        setSelectedVersion(version.versionIndex);
      }}
    >
      <GitCommitVertical />

      <span>
        {version.updatedAt
          ? formatDateWithCustomStyle(new Date(version.updatedAt))
          : 'No date'}
      </span>

      {version.current && (
        <Badge variant="default" className="ml-auto">
          Current
        </Badge>
      )}
    </button>
  );
}
// Define regex at module scope to avoid recreation on each function call
const amPmRegex = / (am|pm)$/i;

function formatDateWithCustomStyle(date: Date): string {
  const formattedDate = format(date, "MMM d yyyy 'at' h:mm a");

  // Replace the AM/PM part with uppercase version
  return formattedDate.replace(amPmRegex, (match) => match.toUpperCase());
}
