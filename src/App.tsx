import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css';
import Homepage from './routes/Homepage';
import RootLayout from './RootLayout';
import Products from './routes/Products';
import CategoryRoute from './routes/CategoryRoute';
import ProductRoute from './routes/ProductRoute';
import { Provider } from 'react-redux';
import { store } from './state/store';
import CheckoutRoute from './routes/CheckoutRoute';
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
      },
    ],
  },
]);
function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
