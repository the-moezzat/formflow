'use client';

import { CircleUserRoundIcon, XIcon } from 'lucide-react';

import { useFileUpload } from '@repo/design-system/hooks/use-file-upload';
import { Button } from '@repo/design-system/components/ui/button';

export default function AvatarUpload() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: 'image/*',
    });

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  return (
    <div className="flex gap-5">
      <div className="relative inline-flex">
        <Button
          variant="outline"
          className="relative size-16 overflow-hidden rounded-2xl p-0 shadow-none"
          onClick={openFileDialog}
          type="button"
          aria-label={previewUrl ? 'Change image' : 'Upload image'}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Avatar preview"
              width={64}
              height={64}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </Button>
        {previewUrl && (
          <Button
            onClick={() => removeFile(files[0]?.id)}
            size="icon"
            className="-top-2 -right-2 absolute size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}

        <input
          {...getInputProps()}
          className="sr-only"
          id="workspace-logo"
          aria-label="Upload image file"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="font-medium text-gray-700 text-xs"
          htmlFor="workspace-logo"
        >
          Workspace logo
        </label>
        <Button
          onClick={openFileDialog}
          aria-haspopup="dialog"
          type="button"
          variant={'outline'}
        >
          {fileName ? 'Replace image' : 'Upload image'}
        </Button>
      </div>

      {/* <div className="inline-flex items-center gap-2 align-top">
        <div
          className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-input"
          aria-label={
            previewUrl ? 'Preview of uploaded image' : 'Default user avatar'
          }
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded image"
              width={64}
              height={64}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="opacity-60" size={16} />
            </div>
          )}
        </div>
        <div className="relative flex gap-2">
          <Button
            onClick={openFileDialog}
            aria-haspopup="dialog"
            type="button"
            variant={'outline'}
          >
            {fileName ? 'Replace image' : 'Upload image'}
          </Button>
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
          />
          <Button
            onClick={() => removeFile(files[0]?.id)}
            aria-label={`Remove ${fileName}`}
            variant="outline"
            type="button"
            disabled={!fileName}
          >
            Remove
          </Button>
        </div>
      </div> */}
    </div>
  );
}
