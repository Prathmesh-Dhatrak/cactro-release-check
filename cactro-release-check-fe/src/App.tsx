import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components/layout/Layout';
import { ReleaseListPage } from '@/pages/ReleaseListPage';
import { ReleaseDetailPage } from '@/pages/ReleaseDetailPage';
import { ROUTES } from '@/config/constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

export function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<ReleaseListPage />} />
            <Route path={ROUTES.RELEASE_DETAIL} element={<ReleaseDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
          },
        }}
      />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
