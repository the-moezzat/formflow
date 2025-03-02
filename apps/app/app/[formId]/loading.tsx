import { LoaderCircle } from 'lucide-react';

function Loading() {
  return (
    <div>
      <div className="flex h-screen items-center justify-center gap-2">
        <LoaderCircle className="shrink-0 animate-spin" />
        {/* <div className="mt-2">Loading...</div> */}
      </div>
    </div>
  );
}

export default Loading;
