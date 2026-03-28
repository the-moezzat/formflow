'use client';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@repo/design-system/components/ui/navigation-menu';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

const links = [
  { href: '/', label: 'Create' },
  { href: '/workflow', label: 'Workflow' },
  { href: '/connect', label: 'Connect' },
  { href: '/results', label: 'Results' },
];

export function EditorNav() {
  const pathname = usePathname();
  const query = useSearchParams();
  const { formId } = useParams();

  const currentPath = pathname.replace(`/${formId}`, '') || '/';

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map(({ href, label }) => (
          <NavigationMenuItem key={href}>
            <Link href={`/${formId}${href}?form=${query.get('form')}`}>
              {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
              }
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={currentPath === href}
              >
                {label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
