import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout';
import { Dashboard } from '@/pages/Dashboard';
import { GovernanceCreate } from '@/pages/GovernanceCreate';
import { GovernanceProposals } from '@/pages/GovernanceProposals';
import { ModulesVM } from '@/pages/ModulesVM';
import { ModulesERC20 } from '@/pages/ModulesERC20';
import { ModulesFeemarket } from '@/pages/ModulesFeemarket';
import { TransactionsSend } from '@/pages/TransactionsSend';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />

            {/* Governance Routes */}
            <Route path="governance/create" element={<GovernanceCreate />} />
            <Route path="governance/proposals" element={<GovernanceProposals />} />

            {/* Module Routes */}
            <Route path="modules/vm" element={<ModulesVM />} />
            <Route path="modules/erc20" element={<ModulesERC20 />} />
            <Route path="modules/feemarket" element={<ModulesFeemarket />} />

            {/* Transaction Routes */}
            <Route path="transactions/send" element={<TransactionsSend />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
