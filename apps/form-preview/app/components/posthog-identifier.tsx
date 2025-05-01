'use client';

import { analytics } from '@repo/analytics/posthog/client';
import { useSession } from '@repo/auth/client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const PostHogIdentifier = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const identified = useRef(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track pageviews
    if (pathname && analytics) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }
      analytics.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!session || identified.current) {
      return;
    }

    analytics.identify(user?.id, {
      email: user?.email,
      firstName: user?.name.split(' ')[0],
      lastName: user?.name.split(' ')[1],
      createdAt: user?.createdAt,
      avatar: user?.image,
    });

    identified.current = true;
  }, [user, session]);

  return null;
};
