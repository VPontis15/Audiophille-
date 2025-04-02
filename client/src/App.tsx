import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Homepage from './routes/Homepage';
import RootLayout from './layouts/RootLayout';
import Products from './routes/Products';
import CategoryRoute from './routes/CategoryRoute';
import ProductRoute from './routes/ProductRoute';
import { Provider } from 'react-redux';
import { store } from './state/store';
import CheckoutRoute from './routes/CheckoutRoute';
import Modal from './components/utils/Modal';
import { Completed } from './components/utils/Completed';
import DashboardLayout from './layouts/DashboardLayout';
import { createPortal } from 'react-dom';
import { ToastContainer } from 'react-toastify';
import DashboardManageProducts from './components/Dashboard/Products/ManageProducts/DashboardManageProducts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardSingleProduct from './components/Dashboard/Products/ManageProducts/DashboardSingleProduct';
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <Products />,
          },
          {
            path: ':category',
            element: <CategoryRoute />,
          },
          {
            path: ':category/:slug',
            element: <ProductRoute />,
          },
        ],
      },
      {
        path: 'checkout',
        element: <CheckoutRoute />,
        loader: () => {
          store.dispatch({ type: 'settings/closeCart' });
          return null;
        },
        children: [
          {
            path: ':transactionId/success',
            element: (
              <Modal>
                <Completed />
              </Modal>
            ),
          },
        ],
      },
    ],
  },
  {
    path: 'admin/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        // element: <Dashboard />,
      },
      {
        path: 'products',
        // element: <DashboardProducts />,
        children: [
          {
            index: true,
            // element: <DashboardProducts />,
          },
          {
            path: 'manage',
            element: <DashboardManageProducts />,
          },
          {
            path: 'create',
            // element: <DashboardCreateProduct />,
            element: <h1>Create</h1>,
          },
          {
            path: 'categories',
            // element: <DashboardCreateProduct />,
            element: <h1>Categories</h1>,
          },
          {
            path: 'brands',
            // element: <DashboardCreateProduct />,
            element: <h1>Brands</h1>,
          },
          {
            path: 'collections',
            // element: <DashboardCreateProduct />,
            element: <h1>Collections</h1>,
          },
          {
            path: 'attributes',
            // element: <DashboardCreateProduct />,
            element: <h1>Attributes</h1>,
          },
          {
            path: 'collections',
            // element: <DashboardCreateProduct />,
            element: <h1>Collections</h1>,
          },
        ],
      },
      {
        path: 'products/:productId',
        element: <DashboardSingleProduct />,
      },
      {
        path: 'orders',
        // element: <DashboardOrders />,
      },
      {
        path: 'orders/:orderId',
        // element: <DashboardOrder />,
      },
      {
        path: 'settings',
        // element: <DashboardSettings />,
      },
    ],
  },
]);

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {createPortal(
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />,
          document.body
        )}
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
