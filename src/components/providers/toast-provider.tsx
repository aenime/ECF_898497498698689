'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: '#fff',
          border: '1px solid #e5e7eb',
          color: '#111827',
        },
      }}
    />
  );
}
