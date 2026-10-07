# NESTA — Minimal home store

A minimal ecommerce storefront built with Node.js, Express, MongoDB, EJS, Multer, and session-based cart state.

## Features

- Editorial homepage with featured products and category collections
- Product catalogue with search, category filters, and sorting
- Product detail pages with related products
- Session cart with quantity updates and item removal
- Demo checkout with shipping summary and simulated payment confirmation
- Product admin with create, read, update, and delete flows
- Image uploads stored in `public/uploads`
- Idempotent MongoDB seed script with six sample products

## Run locally

1. Make sure MongoDB is running.
2. Copy `.env.example` to `.env` and adjust the values if needed.
3. Run `npm install`.
4. Run `npm run seed` to upsert the sample products.
5. Run `npm start` and open `http://localhost:3000`.

## Configuration

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/productdb
SESSION_SECRET=replace-with-a-long-random-string
```

The checkout is intentionally a demonstration. It does not collect real card details, contact a payment provider, charge money, or create fulfilment requests.
