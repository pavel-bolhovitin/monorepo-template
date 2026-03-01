import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    >
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              App config
            </p>
            <div className="flex gap-2">
              <span className="h-12 w-12 rounded-lg bg-brand-200" title="200" />
              <span className="h-12 w-12 rounded-lg bg-brand-400" title="400" />
              <span className="h-12 w-12 rounded-lg bg-brand-600" title="600" />
              <span className="h-12 w-12 rounded-lg bg-brand-800" title="800" />
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Tailwind config package
            </p>
            <div className="flex gap-2">
              <span
                className="h-12 w-12 rounded-lg bg-avocado-200"
                title="200"
              />
              <span
                className="h-12 w-12 rounded-lg bg-avocado-400"
                title="400"
              />
              <span
                className="h-12 w-12 rounded-lg bg-avocado-600"
                title="600"
              />
              <span
                className="h-12 w-12 rounded-lg bg-avocado-800"
                title="800"
              />
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Standard Tailwind
            </p>
            <div className="flex gap-2">
              <span
                className="h-12 w-12 rounded-lg bg-green-200"
                title="slate-200"
              />
              <span
                className="h-12 w-12 rounded-lg bg-green-400"
                title="slate-400"
              />
              <span
                className="h-12 w-12 rounded-lg bg-green-600"
                title="slate-600"
              />
              <span
                className="h-12 w-12 rounded-lg bg-green-800"
                title="slate-600"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
