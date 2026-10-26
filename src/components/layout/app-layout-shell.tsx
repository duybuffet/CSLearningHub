import { useEffect } from 'react';
import { Link, Outlet, ScrollRestoration } from 'react-router-dom';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { useT } from '@/lib/ui-strings';
import { LanguageSwitch } from '@/components/ui/language-switch';
import { SidebarNavigationTree } from './sidebar-navigation-tree';
import { MobileNavigationDrawer } from './mobile-navigation-drawer';

export function AppLayoutShell() {
  const toggleSidebar = useProgressStore((s) => s.toggleSidebar);
  const { lang, t } = useT();

  // Keep <html lang> in sync for screen readers, hyphenation and fonts
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Desktop sidebar — fixed, hidden on mobile */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border-subtle bg-bg-primary md:flex md:flex-col">
        <SidebarNavigationTree />
      </aside>

      {/* Mobile drawer overlay */}
      <MobileNavigationDrawer />

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-72">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex min-w-0 items-center gap-2 border-b border-border-subtle bg-bg-primary/90 px-2 py-1.5 backdrop-blur-md md:hidden">
          <button
            onClick={() => toggleSidebar()}
            className="rounded-btn p-2.5 text-text-secondary transition-colors hover:bg-bg-panel hover:text-text-primary"
            aria-label={t('openContents')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link to="/" className="min-w-0 flex-1 truncate font-serif text-[17px] font-semibold text-text-primary">
            CS Learning Hub
          </Link>
          <div className="pr-2">
            <LanguageSwitch />
          </div>
        </header>

        {/* Page content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:px-14 lg:py-10">
          <Outlet />
        </main>
        {/* New page → start at top; back/forward → restore previous position */}
        <ScrollRestoration />
      </div>
    </div>
  );
}
