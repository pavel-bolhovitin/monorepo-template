/**
 * Компонент, использующий глобальные переменные из @repo/tailwind-config:
 * --color-blue-1000, --color-purple-1000, --color-red-1000
 */
export function ThemeColorsDemo() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Цвета из Tailwind Config
      </h2>
      <div className="flex flex-wrap gap-3">
        <div
          className="h-14 w-28 rounded-lg bg-blue-1000 flex items-center justify-center text-white text-sm font-medium shadow-sm"
          title="--color-blue-1000"
        >
          blue-1000
        </div>
        <div
          className="h-14 w-28 rounded-lg bg-purple-1000 flex items-center justify-center text-white text-sm font-medium shadow-sm"
          title="--color-purple-1000"
        >
          purple-1000
        </div>
        <div
          className="h-14 w-28 rounded-lg bg-red-1000 flex items-center justify-center text-white text-sm font-medium shadow-sm"
          title="--color-red-1000"
        >
          red-1000
        </div>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Классы <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">bg-blue-1000</code>,{" "}
        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">bg-purple-1000</code>,{" "}
        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">bg-red-1000</code> из{" "}
        <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@theme</code> в tailwind-config.
      </p>
    </div>
  );
}
