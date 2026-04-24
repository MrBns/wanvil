import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AnvilProvider } from "@/components/AnvilProvider";
import { RootLayout } from "@/layouts/RootLayout";
import { RpcProvider } from "@/lib/rpcContext";
import AddressDetailPage from "@/pages/AddressDetailPage";
import AddressListPage from "@/pages/AddressListPage";
import AnvilManagerPage from "@/pages/AnvilManagerPage";
import BlockDetailPage from "@/pages/BlockDetailPage";
import BlocksPage from "@/pages/BlocksPage";
import DashboardPage from "@/pages/DashboardPage";
import TxDetailPage from "@/pages/TxDetailPage";
import TxListPage from "@/pages/TxListPage";

export default function App() {
  return (
    <BrowserRouter>
      <RpcProvider>
        <AnvilProvider>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/blocks" element={<BlocksPage />} />
              <Route path="/tx" element={<TxListPage />} />
              <Route path="/tx/:hash" element={<TxDetailPage />} />
              <Route path="/block/:id" element={<BlockDetailPage />} />
              <Route path="/address" element={<AddressListPage />} />
              <Route path="/address/:address" element={<AddressDetailPage />} />
              <Route path="/anvil" element={<AnvilManagerPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AnvilProvider>
      </RpcProvider>
    </BrowserRouter>
  );
}
