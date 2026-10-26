import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { SidebarNavigationTree } from './sidebar-navigation-tree';
import { useT } from '@/lib/ui-strings';

export function MobileNavigationDrawer() {
  const sidebarOpen = useProgressStore((s) => s.sidebarOpen);
  const toggleSidebar = useProgressStore((s) => s.toggleSidebar);
  const { t } = useT();

  // Close after navigating (a chapter was picked) — not on every tap inside,
  // so parts can be expanded without the drawer closing.
  const { pathname } = useLocation();
  useEffect(() => {
    toggleSidebar(false);
  }, [pathname, toggleSidebar]);

  // Escape closes the drawer
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && toggleSidebar(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen, toggleSidebar]);

  // Lock body scroll when open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            aria-hidden="true"
            onClick={() => toggleSidebar(false)}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-y-0 left-0 z-50 w-80 max-w-[86vw] bg-bg-primary shadow-[4px_0_24px_rgb(0_0_0/0.12)] md:hidden"
            aria-label="Navigation"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => toggleSidebar(false)}
              className="absolute right-2 top-3 rounded-btn p-2.5 text-text-muted transition-colors hover:bg-bg-panel hover:text-text-primary"
              aria-label={t('closeContents')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Same nav tree as the desktop sidebar */}
            <div
              className="h-full overflow-hidden"
              // Tapping the chapter you're already on doesn't change the route
              onClick={(e) => (e.target as Element).closest('a') && toggleSidebar(false)}
            >
              <SidebarNavigationTree />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
