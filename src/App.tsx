import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css';
import Homepage from './routes/Homepage';
import RootLayout from './RootLayout';
import Products from './routes/Products';
import CategoryRoute from './routes/CategoryRoute';
import ProductRoute from './routes/ProductRoute';

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
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
