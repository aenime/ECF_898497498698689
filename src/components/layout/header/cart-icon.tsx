'use client';

import { Button } from '@/components/ui/button';

interface CartIconProps {
  count: number;
}

export function CartIcon({ count }: CartIconProps) {
  return (
    <Button variant="ghost" size="sm" className="relative">
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3M7 13v4a2 2 0 002 2h8a2 2 0 002-2v-4M9 17a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
      <span className="ml-1 hidden sm:block">Cart</span>
    </Button>
  );
}
