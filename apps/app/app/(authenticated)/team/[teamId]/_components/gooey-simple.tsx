export default function GooeySimple() {
  return (
    <div className="flex items-center">
      <div className="h-40 w-32 rounded-lg bg-green-300" />
      <div className="before:-translate-y-full before:-translate-x-1/2 after:-translate-x-1/2 relative h-36 w-1 bg-green-300 before:absolute before:top-[-3px] before:left-1/2 before:h-2 before:w-2 before:rounded-full before:bg-transparent before:shadow-[0_4px_0_0_rgba(134,239,172)] before:content-[''] after:absolute after:bottom-[-3px] after:left-1/2 after:h-2 after:w-2 after:translate-y-full after:rounded-full after:bg-transparent after:shadow-[0_-4px_0_0_rgba(134,239,172)] after:content-['']" />
      <div className="h-40 w-80 rounded-lg bg-green-300" />
    </div>
  );
}
