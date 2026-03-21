import { RouterProvider } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from './context/CartContext';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ThemeProvider>
  );
}
