# STYLE — MERN E-Commerce (Clothing Brand)

Full-stack e-commerce application for a clothing brand built with **MongoDB**, **Express**, **React**, and **Node.js**.

## Features

- **User Authentication** — JWT-based login/register with HTTP-only cookies
- **Product Catalog** — Categories, filters, search, sort, pagination
- **Cart & Wishlist** — Persistent cart and wishlist for logged-in users
- **Checkout & Orders** — Shipping address, order creation, order history
- **Payments** — Stripe Payment Intents (card payments)
- **Admin Dashboard** — Manage products, orders, users; image uploads
- **Reviews & Ratings** — Product reviews and average rating
- **Cloud Images** — Cloudinary for product image uploads
- **REST API** — Structured routes and controllers
- **Responsive UI** — React + Tailwind CSS, mobile-friendly

## Folder Structure

```
ecommerce-app/
├── client/                 # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Layout, Header, Footer, ProductCard
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── pages/          # Home, Shop, Product, Cart, Checkout, etc.
│   │   │   └── admin/     # Admin layout, dashboard, products, orders, users
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── server/                 # Node/Express backend
│   ├── src/
│   │   ├── config/         # db.js, cloudinary.js
│   │   ├── controllers/    # auth, product, cart, wishlist, order, payment, upload, review, admin
│   │   ├── middleware/     # auth.js, admin.js, errorHandler.js, upload.js
│   │   ├── models/         # User, Product, Order, Cart, Wishlist
│   │   ├── routes/         # auth, product, cart, wishlist, order, payment, review, upload, admin
│   │   └── index.js
│   └── package.json
├── deploy/                 # Deployment scripts
├── package.json            # Root: install-all, dev, build, start
├── .env.example
└── README.md
```

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **Stripe** account (test keys for development)
- **Cloudinary** account (for image uploads)

## Setup

### 1. Clone and install

```bash
cd ecommerce-app
npm run install-all
```

### 2. Environment variables

**Server** — create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # optional, for webhooks
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Client** — create `client/.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Copy from `env.example` files if provided.

### 3. Run development

```bash
npm run dev
```

- **Frontend:** http://localhost:5173  
- **Backend API:** http://localhost:5000  

Vite proxies `/api` to the backend when using the dev server.

### 4. First admin user

Register a user from the app, then run from the `server` directory:

```bash
cd server
node scripts/createAdmin.js your@email.com
```

Or set `ADMIN_EMAIL` in `server/.env` and run `node scripts/createAdmin.js`.

## API Endpoints (REST)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |
| GET | `/api/products` | List products (query: page, limit, category, search, minPrice, maxPrice, sort, featured) |
| GET | `/api/products/categories` | List categories |
| GET | `/api/products/slug/:slug` | Product by slug |
| GET | `/api/products/:id` | Product by ID |
| GET | `/api/cart` | Get cart (protected) |
| POST | `/api/cart` | Add to cart (protected) |
| PUT | `/api/cart/item` | Update cart item qty (protected) |
| DELETE | `/api/cart/item/:itemId` | Remove from cart (protected) |
| DELETE | `/api/cart` | Clear cart (protected) |
| GET | `/api/wishlist` | Get wishlist (protected) |
| POST | `/api/wishlist` | Add to wishlist (protected) |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist (protected) |
| POST | `/api/orders` | Create order (protected) |
| GET | `/api/orders` | My orders (protected) |
| GET | `/api/orders/:id` | Order by ID (protected) |
| POST | `/api/payments/create-payment-intent` | Create Stripe Payment Intent (protected) |
| POST | `/api/reviews/:productId` | Add review (protected) |
| POST | `/api/upload/single` | Upload one image (admin) |
| POST | `/api/upload/multiple` | Upload multiple images (admin) |
| GET | `/api/admin/stats` | Dashboard stats (admin) |
| GET/POST/PUT/DELETE | `/api/admin/products` | CRUD products (admin) |
| GET | `/api/admin/orders` | List orders (admin) |
| PUT | `/api/admin/orders/:id` | Update order status (admin) |
| GET | `/api/admin/users` | List users (admin) |
| PUT | `/api/admin/users/:id` | Update user role (admin) |

## Build & production

```bash
npm run build
```

Builds the React app into `client/dist`. Serve it with a static server and point the backend `CLIENT_URL` to your frontend origin.

```bash
npm start
```

Runs the backend only (expects frontend to be served separately).

## Deployment

- **Backend:** Deploy the `server/` folder to a Node host (Railway, Render, Heroku, etc.). Set env vars there.
- **Frontend:** Build with `npm run build` (from repo root or `client/`) and deploy `client/dist` to Vercel, Netlify, or any static host. Set `VITE_STRIPE_PUBLISHABLE_KEY` at build time.
- **Database:** Use MongoDB Atlas and set `MONGO_URI`.
- **Stripe:** Use live keys in production; configure webhook URL for `payment_intent.succeeded` if you use webhooks (optional for basic flow).
- **Cloudinary:** Use the same env vars in production.

See `deploy/` for example scripts (e.g. build-and-upload or platform-specific config).

## License

MIT.
