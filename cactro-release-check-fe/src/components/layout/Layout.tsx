import { Outlet } from 'react-router-dom';
import { Header } from './Header';

/**
 * Root layout component wrapping all pages.
 * Provides consistent header and content area.
 */
export function Layout(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
