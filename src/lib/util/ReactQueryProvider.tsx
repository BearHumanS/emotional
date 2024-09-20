'use client';

import { PropsWithChildren } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

function ReactQueryProvider({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 0 } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default ReactQueryProvider;
