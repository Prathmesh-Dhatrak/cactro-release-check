import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

/**
 * Application header with branding.
 * Displayed at the top of every page.
 */
export function Header(): JSX.Element {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="group">
          <h1 className="text-center text-2xl font-bold italic text-gray-900 transition-colors group-hover:text-primary-600">
            ReleaseCheck
          </h1>
          <p className="text-center text-sm text-gray-500">
            Your all-in-one release checklist tool
          </p>
        </Link>
      </div>
    </header>
  );
}
