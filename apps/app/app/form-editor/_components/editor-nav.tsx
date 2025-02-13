'use client';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@repo/design-system/components/ui/navigation-menu';
import { usePathname, useSearchParams } from 'next/navigation';

const links = [
  { href: '/', label: 'Create' },
  { href: '/workflow', label: 'Workflow' },
  { href: '/connect', label: 'Connect' },
  { href: '/results', label: 'Results' },
];

export function EditorNav() {
  const pathname = usePathname();
  const query = useSearchParams();
  const currentPath = pathname.replace('/form-editor', '') || '/';

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map(({ href, label }) => (
          <NavigationMenuItem key={href}>
            <Link
              href={`/form-editor${href}?form=${query.get('form')}`}
              legacyBehavior
              passHref
            >
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
