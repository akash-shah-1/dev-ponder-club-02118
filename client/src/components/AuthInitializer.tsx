import { useEffect } from 'react';
import { useApiClient } from '@/lib/api-client';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  // Initialize API client with auth token
  useApiClient();

  return <>{children}</>;
};
