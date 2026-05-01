'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 rounded ${
          locale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        disabled={isPending}
      >
        English
      </button>
      <button
        onClick={() => switchLocale('zh')}
        className={`px-2 py-1 rounded ${
          locale === 'zh' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        disabled={isPending}
      >
        中文
      </button>
    </div>
  );
} 