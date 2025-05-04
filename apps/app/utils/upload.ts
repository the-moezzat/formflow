import { auth } from '@repo/auth/server';
import { type FileRouter, UploadError, storage } from '@repo/storage';
import { headers } from 'next/headers';

export const router: FileRouter = {
  imageUploader: storage({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
        const session = await auth.api.getSession({
        headers: await headers(), // from next/headers
        });
      if (!session?.user) {
        throw new UploadError('Unauthorized');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata }) => ({ uploadedBy: metadata.userId })),
};
