import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./font.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { WishlistProvider } from "./Component/Context/WishlistContext.jsx";
import { CartProvider } from "./Component/Context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <WishlistProvider>
      <CartProvider>
      <App />
      </CartProvider>
    </WishlistProvider>
    </BrowserRouter>
  </StrictMode>
);
