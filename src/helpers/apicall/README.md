# 🌐 apiCall Utility

A **lightweight**, **reusable** API helper for **JavaScript/React** applications.  
It wraps the native **Fetch API** to provide consistent behavior across all HTTP requests — including **automatic token injection**, **unified error handling**, and **query parameter serialization**.

---

## 🚀 Features

- ✅ **Unified API**: Simple methods for `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- ✅ **Auto-Authentication**: Automatically attaches `x-access-token` and `x-access-user` from `localStorage`.
- ✅ **Smart Params**: Automatically serializes query parameters (including arrays).
- ✅ **Loading State**: Built-in support for toggling a loading state boolean.
- ✅ **Error Handling**: Unified success/error parsing and callbacks.
- ✅ **Zero Dependencies**: Uses native `fetch`, no need for `axios`.

---

## 📦 Installation

Copy the `apicall` folder into your project's helper or utils directory:

```text
src/
  helpers/
    apicall/
      ├── apiCall.js
      ├── getparams.js
      ├── headers.js
      ├── request.js
      └── README.md
```

---

## 🛠️ Usage

Import `apiCall` and use it to make requests.

```javascript
import { apiCall } from "./helpers/apicall/apiCall";
```

### 1. Basic GET Request

```javascript
const fetchProducts = async () => {
  try {
    const data = await apiCall.get({
      route: "products", // Base URL is prepended automatically
      params: { category: "electronics", sort: "price" },
    });
    console.log("Products:", data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};
```

### 2. POST Request with Payload & Loading State

```javascript
const createOrder = async () => {
  await apiCall.post({
    route: "orders",
    payload: { productId: 123, quantity: 2 },
    setLoading: (isLoading) => console.log("Loading:", isLoading), // Updates your loading state
    onSuccess: (data) => console.log("Order created:", data),
    onError: (err) => console.error("Order failed:", err),
  });
};
```

---

## � Configuration Object

The `apiCall` methods accept a configuration object with the following properties:

| Property | Type | Description |
| :--- | :--- | :--- |
| `route` | `string` | **Required**. The API endpoint (e.g., `products` or `https://api.com/data`). |
| `payload` | `object` | Body data for `POST`, `PUT`, `PATCH` requests. |
| `params` | `object` | Query parameters object. Arrays are stringified. |
| `setLoading` | `function` | Callback to set loading state (`true` before call, `false` after). |
| `onSuccess` | `function` | Callback executed on successful response. |
| `onError` | `function` | Callback executed on error. |
| `afterCall` | `function` | Callback executed finally (regardless of success/error). |

---

## 🔐 Authentication

The utility automatically looks for a `user` object in `localStorage` to attach headers:

```javascript
// Expected localStorage structure
localStorage.setItem("user", JSON.stringify({
  token: "your-auth-token",
  user_id: "user-123"
}));
```

**Headers injected:**
- `Content-Type`: `application/json`
- `authorization`: `user.token`
