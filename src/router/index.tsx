import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserDashboard from '../pages/user/UserDashboard.tsx'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminLayout from '../layouts/AdminLayout.tsx'
import AdminDashboard from '../pages/admin/AdminDashboard.tsx'
import UserManagement from '../pages/admin/UserManagement.tsx'
import FinanceManagement from '../pages/admin/FinanceManagement.tsx'
import SystemSettings from '../pages/admin/SystemSettings.tsx'
import NotFoundPage from '../pages/NotFoundPage.tsx'
import AdminProtectedRoute from '../components/AdminProtectedRoute'

// Login route protection - redirects authenticated users to dashboard
const ProtectedLoginRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true'
  
  if (isAuthenticated) {
    window.location.href = '/admin/dashboard'
    return null
  }
  
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element:<ProtectedLoginRoute><UserDashboard /></ProtectedLoginRoute>,
    errorElement: <NotFoundPage />,
  },
  
  {
    path: '/admin',
    element: <ProtectedLoginRoute><AdminLogin /></ProtectedLoginRoute>,
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: '/admin/users',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <UserManagement />,
      },
    ],
  },
  {
    path: '/admin/finance',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <FinanceManagement />,
      },
    ],
  },
  {
    path: '/admin/settings',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SystemSettings />,
      },
    ],
  },
])

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />
}
