export function PaletteShowcase() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Tailwind config package from ui package
      </p>
      <div className="flex gap-2">
        <span className="h-12 w-12 rounded-lg bg-avocado-200" title="200" />
        <span className="h-12 w-12 rounded-lg bg-avocado-400" title="400" />
        <span className="h-12 w-12 rounded-lg bg-avocado-600" title="600" />
        <span className="h-12 w-12 rounded-lg bg-avocado-800" title="800" />
      </div>
    </div>
  );
}
