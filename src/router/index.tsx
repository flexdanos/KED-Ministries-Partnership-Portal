import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserDashboard from '../pages/user/UserDashboard.tsx'
import AdminLogin from '../pages/admin/AdminLogin.tsx'
import AdminLayout from '../layouts/AdminLayout.tsx'
import AdminDashboard from '../pages/admin/AdminDashboard.tsx'
import UserManagement from '../pages/admin/UserManagement.tsx'
import SystemSettings from '../pages/admin/SystemSettings.tsx'
import NotFoundPage from '../pages/NotFoundPage.tsx'

// Admin route protection component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true'
  if (!isAuthenticated) {
    // In a real app, you'd use Navigate component
    window.location.href = '/admin'
    return null
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <UserDashboard />,
    errorElement: <NotFoundPage />,
  },
  
  {
    path: '/admin',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
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
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      {
        index: true,
        element: <UserManagement />,
      },
    ],
  },
  {
    path: '/admin/settings',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
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
