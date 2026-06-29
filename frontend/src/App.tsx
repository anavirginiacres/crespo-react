import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import LayoutChrome from "@/components/LayoutChrome";
import Nav from "@/components/Navigation/Nav";
import HomePage from "@/pages/HomePage";
import ProductosPage from "@/pages/ProductosPage";
import ProductoDetallePage from "@/pages/ProductoDetallePage";
import CarritoPage from "@/pages/CarritoPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminApprovalsPage from "@/pages/admin/AdminApprovalsPage";
import AdminMyChangesPage from "@/pages/admin/AdminMyChangesPage";
import AdminSubcategoriesPage from "@/pages/admin/AdminSubcategoriesPage";
import NotFoundPage from "@/pages/NotFoundPage";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <LayoutChrome nav={<Nav />}>{children}</LayoutChrome>
    </CartProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />
      <Route
        path="/productos"
        element={
          <PublicLayout>
            <ProductosPage />
          </PublicLayout>
        }
      />
      <Route
        path="/productos/detalle/:id"
        element={
          <PublicLayout>
            <ProductoDetallePage />
          </PublicLayout>
        }
      />
      <Route
        path="/carrito"
        element={
          <PublicLayout>
            <CarritoPage />
          </PublicLayout>
        }
      />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/products" replace />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="approvals" element={<AdminApprovalsPage />} />
        <Route path="my-changes" element={<AdminMyChangesPage />} />
        <Route path="subcategories" element={<AdminSubcategoriesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
