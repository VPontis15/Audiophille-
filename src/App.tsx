import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css';
import Homepage from './routes/Homepage';
import RootLayout from './RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
