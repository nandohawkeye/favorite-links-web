'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  function handleLogout() {
    Cookies.remove('token');
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold text-gray-800">Favorite Links</h1>
          <nav className="flex gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Links
            </Link>
            <Link
              href="/tags"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Tags
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Sair
        </button>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
