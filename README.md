# ⚙️ Alphabite Medusa Client

[![npm version](https://img.shields.io/npm/v/@alphabite/medusa-client)](https://www.npmjs.com/package/@alphabite/medusa-client)
[![npm downloads](https://img.shields.io/npm/dm/@alphabite/medusa-client)](https://www.npmjs.com/package/@alphabite/medusa-client)
![MIT License](https://img.shields.io/npm/l/@alphabite/medusa-client)
![Types Included](https://img.shields.io/npm/types/@alphabite/medusa-client)

> Drop-in replacement for `@medusajs/js-sdk` with plugin support for Wishlists, PayPal, Reviews, and more.

The **Alphabite Medusa Client** wraps the Medusa JS SDK and adds support for rich frontend integrations via plugin architecture.

---

## 📚 Table of Contents

- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
- [🔁 Drop-in Replacement](#-drop-in-replacement)
- [🔌 Plugin Injection](#-plugin-injection)
- [🔐 Auth Handling](#-auth-handling)
- [✅ Example: Wishlist Usage](#-example-wishlist-usage)
- [🧩 Plugins Included](#-plugins-included)
- [🧪 TypeScript Support](#-typescript-support)
- [📁 Folder Structure Tip](#-folder-structure-tip)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## 📦 Installation

```bash
npm install @alphabite/medusa-client
```

---

## 🚀 Usage

```ts
import {
  AlphabiteMedusaClient,
  wishlistPlugin,
  paypalPlugin,
  reviewsPlugin,
} from '@alphabite/medusa-client'

const sdk = new AlphabiteMedusaClient(
  {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    debug: process.env.NODE_ENV === 'development',
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  },
  [wishlistPlugin, paypalPlugin, reviewsPlugin],

  // Optional options config to add a global getAuthHeader function for all endpoints
  {
    // supports async functions, for example a server action that fetches the token from headers
    getAuthHeader: async () => {
      const token = await getToken(); // your own function that returns the auth token

      return {
        authorization: `Bearer ${token}`,
      }
    },
  }
)
```

---

## 🔁 Drop-in Replacement

To migrate from the default Medusa SDK:

```ts
// BEFORE
import Medusa from '@medusajs/js-sdk'
const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  debug: process.env.NODE_ENV === 'development',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

// AFTER
import { AlphabiteMedusaClient, wishlistPlugin } from '@alphabite/medusa-client'

const sdk = new AlphabiteMedusaClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    debug: process.env.NODE_ENV === 'development',
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  },
  [wishlistPlugin], {
    // supports async functions, for example a server action that fetches the token from headers
    getAuthHeader: async () => {
      const token = await getToken(); // your own function that returns the auth token

      return {
        authorization: `Bearer ${token}`,
      }
    },
  }
)
```

---

## 🔌 Plugin Injection

Pass an array of plugins as the second argument:

```ts
[wishlistPlugin]
```

Each plugin registers a namespace like:

```ts
sdk.alphabite.wishlist
```

---

## 🔐 Auth Handling

### 1. Global headers with `getAuthHeader`

```ts
const sdk = new AlphabiteMedusaClient(
  { baseUrl },
  [wishlistPlugin],
  {
    // supports async function, for example a server action that fetches the token from headers
    getAuthHeader: async () => {
      const token = await getToken(); // your own function that returns the auth token

      return {
        authorization: `Bearer ${token}`,
      }
    },
  }
)
```

### 2. Per-request headers

```ts
await sdk.alphabite.wishlist.create({ name: 'Favorites' }, {
  'x-request-id': 'abc',
})
```

---

## ✅ Example: Wishlist Usage

```ts
await sdk.alphabite.wishlist.create({ name: 'My Sneakers' })

await sdk.alphabite.wishlist.addItem({
  id: 'wishlist_id',
  product_id: 'variant_id',
})

const { data: items } = await sdk.alphabite.wishlist.listItems({
  id: 'wishlist_id',
})
```

---

## 🧩 Plugins Included

| Plugin        | Namespace         | Description                         |
|---------------|-------------------|-------------------------------------|
| `wishlist`    | `sdk.alphabite.wishlist` | Multi-wishlist system              |

---

## 🧪 TypeScript Support

Includes full types for every plugin endpoint:
- `Wishlist`, `WishlistItem`, `AddItemToWishlistInput`, etc.
- Fully typed SDK, request bodies, and responses

---

## 📁 Folder Structure Tip

Create a central instance:

```ts
// lib/sdk.ts
import {
  AlphabiteMedusaClient,
  wishlistPlugin,
} from '@alphabite/medusa-client'

export const sdk = new AlphabiteMedusaClient(
  { baseUrl: process.env.NEXT_PUBLIC_API_URL! },
  [wishlistPlugin],
  {
    // supports async function, for example a server action that fetches the token from headers
    getAuthHeader: async () => {
      const token = await getToken(); // your own function that returns the auth token

      return {
        authorization: `Bearer ${token}`,
      }
    },
  }
)
```

Use across your app:

```ts
import { sdk } from '@/lib/sdk'

await sdk.alphabite.wishlist.list({ limit: 10 })
```

---

## 🤝 Contributing

Want to build plugins or extend core support? PRs are welcome!

---

## 📝 License

MIT © Alphabite — extend and use freely.
