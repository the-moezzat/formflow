import type { ReactNode } from 'react';
import EditorHeader from './_components/editor-header';

function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="grid h-dvh grid-rows-[40px,1fr] gap-4 p-2">
      <EditorHeader />
      {children}
    </main>
  );
}

export default Layout;
