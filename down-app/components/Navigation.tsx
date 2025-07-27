'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className='fixed bottom-0 left-0 right-0 bg-[var(--card-bg-dark)] border-t border-[var(--border)] md:hidden z-50'>
        <div className='flex justify-around'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-3 px-4 min-w-0 flex-1 transition-colors ${
                  isActive
                    ? 'text-[var(--primary)] bg-[var(--border)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className='w-6 h-6 mb-1' />
                <span className='text-xs font-medium'>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop/Tablet Top Navigation */}
      <nav className='hidden md:block bg-[var(--card-bg-dark)] border-b border-[var(--border)]'>
        <div className='max-w-4xl mx-auto px-4'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-8'>
              <h1 className='text-xl font-bold text-[var(--text-primary)]'>Down</h1>
              <div className='flex space-x-1'>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--border)] text-[var(--primary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]'
                      }`}
                    >
                      <Icon className='w-5 h-5 mr-2' />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
