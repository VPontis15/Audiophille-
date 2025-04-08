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
import DeleteProductConfirmation from './components/components/ui/DeleteProductConfirmation ';
import DashboardManageOrders from './components/Dashboard/Orders/DashboardManageOrders';
import DashboardProductCategories from './components/Dashboard/Products/Categories/DashboardProductCategories';
import DashboardProductBrands from './components/Dashboard/Products/Brands/DashboardProductBrands';
import AddForm from './components/components/ui/AddForm';
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
              <Modal returnPath="/">
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

        children: [
          {
            index: true,
            // element: <DashboardProducts />,
          },
          {
            path: 'manage',
            element: <DashboardManageProducts />,
            children: [
              {
                path: ':slug/delete',
                element: (
                  <Modal returnPath="/admin/dashboard/products/manage">
                    <DeleteProductConfirmation
                      promptTitle="Delete Product"
                      promptSubTitle="Are you sure you want to delete this product?"
                      endpoint="products"
                      deleteId="slug"
                      message="Product deleted successfully"
                      returnPath="/admin/dashboard/products/manage"
                    />
                  </Modal>
                ),
              },
            ],
          },
          {
            path: 'create',
            // element: <DashboardCreateProduct />,
            element: <h1>Create</h1>,
          },
          {
            path: 'categories',
            // element: <DashboardCreateProduct />,
            element: <DashboardProductCategories />,
            children: [
              {
                path: 'create',
                element: (
                  <Modal returnPath="/admin/dashboard/products/categories">
                    <AddForm />
                  </Modal>
                ),
              },
              {
                path: ':slug/delete',
                element: (
                  <Modal returnPath="/admin/dashboard/products/categories">
                    <DeleteProductConfirmation
                      promptTitle="Delete Category"
                      promptSubTitle="Are you sure you want to delete this category?"
                      endpoint="categories"
                      deleteId="slug"
                      message="Category deleted successfully"
                      returnPath="/admin/dashboard/products/categories"
                    />
                  </Modal>
                ),
              },
            ],
          },
          {
            path: 'brands',
            // element: <DashboardCreateProduct />,
            element: <DashboardProductBrands />,
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
        children: [
          {
            index: true,
          },
          {
            path: 'manage',
            element: <DashboardManageOrders />,
            children: [
              {
                path: ':id/delete',
                element: (
                  <Modal returnPath="/admin/dashboard/orders/manage">
                    <DeleteProductConfirmation
                      promptTitle="Delete Order"
                      promptSubTitle="Are you sure you want to delete this order?"
                      endpoint="orders"
                      deleteId="id"
                      message="Order deleted successfully"
                      returnPath="/admin/dashboard/orders/manage"
                    />
                  </Modal>
                ),
              },
            ],
          },
        ],
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
