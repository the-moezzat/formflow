import { router } from '@/utils/upload';
import { createRouteHandler } from '@repo/storage';

export const { GET, POST } = createRouteHandler({ router });