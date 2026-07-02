import { createBrowserRouter } from 'react-router-dom';
import { AppLayoutShell } from './components/layout/app-layout-shell';
import { HomePage } from './pages/home-page';
import { TopicPage } from './pages/topic-page';

// Route table: layout shell wraps home + topic pages.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayoutShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'phase/:phaseId/:topicSlug', element: <TopicPage /> },
    ],
  },
]);
