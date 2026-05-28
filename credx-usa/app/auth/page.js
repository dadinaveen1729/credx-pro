'use client';

import { AuthProvider } from '@/components/auth/AuthProvider';
import EnhancedAuthForm from '@/components/auth/EnhancedAuthForm';

export default function AuthPage() {
  return (
    <AuthProvider>
      <EnhancedAuthForm />
    </AuthProvider>
  );
}
