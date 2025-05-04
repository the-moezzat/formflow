'use client';

import { CircleUserRoundIcon, XIcon } from 'lucide-react';

import { useUploadThing } from '@/utils/uploadthing-helper';
import { Button } from '@repo/design-system/components/ui/button';
import {
  type FileWithPreview,
  useFileUpload,
} from '@repo/design-system/hooks/use-file-upload';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function AvatarUpload({
  onFilesAdded,
  onFilesChange,
  onFilesRemove,
  onFileUploaded,
  label,
}: {
  onFilesAdded?: (files: FileWithPreview[]) => void;
  onFilesChange?: (files: FileWithPreview[]) => void;
  onFilesRemove?: (files: FileWithPreview[]) => void;
  onFileUploaded?: (fileUrl: string) => void;
  label?: string;
}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);
  const abortController = new AbortController();
  // Store file state reference to be able to update it after upload completes
  const filesRef = useRef<FileWithPreview[]>([]);

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      console.log('Files: ', res);
      const fileUrl = res[0].ufsUrl;
      setCurrentFileUrl(fileUrl);

      // Update the file preview with the actual uploaded image URL
      if (filesRef.current.length > 0 && filesRef.current[0]) {
        // Create a new file object with updated preview URL
        const updatedFile = {
          ...filesRef.current[0],
          preview: fileUrl,
        };

        // If we have an onFilesChange callback, call it with updated files
        if (onFilesChange) {
          onFilesChange([updatedFile]);
        }
      }

      onFileUploaded?.(fileUrl);
      setUploadProgress(0);
      toast.success('Upload Completed', { id: 'upload' });
    },
    onUploadBegin: () => {
      toast.loading('Uploading...', { id: 'upload' });
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      console.log('Upload Progress: ', progress);
      setUploadProgress(progress);
    },
    uploadProgressGranularity: 'all',
    onUploadError: (error: Error) => {
      toast.error(`ERROR! ${error.message}`, { id: 'upload' });
      setUploadProgress(0);
    },
    signal: abortController.signal,
  });

  const handleCancelUpload = () => {
    abortController.abort();
    toast.info('Upload cancelled', { id: 'upload' });
    setUploadProgress(0);
  };

  // Helper function to extract file key from URL
  const getFileKeyFromUrl = (url: string) => {
    if (!url) return null;
    // Extract file key from URL pattern https://<APP_ID>.ufs.sh/f/<FILE_KEY>
    const match = url.match(/\/f\/([^/]+)$/);
    return match ? match[1] : null;
  };

  // Helper function to delete file via server action
  const deleteFileFromStorage = async (fileUrl: string) => {
    if (!fileUrl) return;

    const fileKey = getFileKeyFromUrl(fileUrl);
    if (!fileKey) {
      console.error('Could not extract file key from URL:', fileUrl);
      return;
    }

    try {
      // The actual deletion would happen through a server action
      // This would call the UTApi.deleteFiles method on the server
      const response = await fetch('/api/uploadthing/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: 'image/*',
      onFilesAdded: async (files) => {
        // Update our ref with the current files
        filesRef.current = files;

        // If we already have a file uploaded, we should delete it first
        if (currentFileUrl) {
          try {
            toast.loading('Removing previous image...');
            await deleteFileFromStorage(currentFileUrl);
            toast.success('Previous image removed');
          } catch (error) {
            console.error('Failed to delete previous file:', error);
            toast.error('Failed to remove previous image');
          }
        }

        startUpload(files.map((file) => file.file as File));
        onFilesAdded?.(files);
      },
      onFilesChange: (files) => {
        // Update our ref when files change
        filesRef.current = files;
        onFilesChange?.(files);
      },
    });

  const handleRemoveImage = async () => {
    // Remove from uploadthing if we have a URL
    if (currentFileUrl) {
      try {
        toast.loading('Removing image...');
        await deleteFileFromStorage(currentFileUrl);
        toast.success('Image removed');
        setCurrentFileUrl(null);
      } catch (error) {
        console.error('Failed to delete file:', error);
        toast.error('Failed to remove image');
      }
    }

    // Remove from local state
    if (files[0]) {
      removeFile(files[0].id);
      onFilesRemove?.(files);
    }
  };

  // Use the uploaded image URL for preview if available, otherwise use the local preview
  const previewUrl = currentFileUrl || files[0]?.preview || null;
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
            onClick={handleRemoveImage}
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
          {label || 'Workspace logo'}
        </label>
        {isUploading ? (
          <Button
            variant="outline"
            onClick={handleCancelUpload}
            className="relative overflow-hidden"
            type="button"
          >
            <div
              className="absolute top-0 bottom-0 left-0 bg-primary/20 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
            <span className="relative z-10">{`${Math.round(uploadProgress)}%`}</span>
          </Button>
        ) : (
          <Button
            onClick={openFileDialog}
            aria-haspopup="dialog"
            type="button"
            variant={'outline'}
          >
            {fileName ? 'Replace image' : 'Upload image'}
          </Button>
        )}
      </div>
    </div>
  );
}
