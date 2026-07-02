import { Outlet } from 'react-router-dom';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { SidebarNavigationTree } from './sidebar-navigation-tree';
import { MobileNavigationDrawer } from './mobile-navigation-drawer';

export function AppLayoutShell() {
  const toggleSidebar = useProgressStore((s) => s.toggleSidebar);

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Desktop sidebar — fixed, hidden on mobile */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border-subtle bg-bg-card md:flex md:flex-col">
        <SidebarNavigationTree />
      </aside>

      {/* Mobile drawer overlay */}
      <MobileNavigationDrawer />

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:pl-60">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-bg-card/90 px-4 py-3 backdrop-blur-sm md:hidden">
          <button
            onClick={() => toggleSidebar()}
            className="rounded-btn p-1.5 text-text-secondary transition-colors hover:bg-bg-panel hover:text-text-primary"
            aria-label="Open navigation"
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
          <span className="text-base font-semibold text-text-primary">CS Learning Hub</span>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
