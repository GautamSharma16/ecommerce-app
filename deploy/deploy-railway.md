# Deploy to Railway

## Backend (Node/Express)

1. Create a new project on [Railway](https://railway.app).
2. Add a service: "Deploy from GitHub" and select this repo.
3. Set **Root Directory** to `server`.
4. Set **Build Command**: (leave empty or `npm install`).
5. Set **Start Command**: `npm start` or `node src/index.js`.
6. Add environment variables in Railway dashboard:
   - `PORT` (Railway sets this automatically; you can use it)
   - `MONGO_URI` (e.g. MongoDB Atlas connection string)
   - `JWT_SECRET`
   - `CLIENT_URL` (your frontend URL, e.g. https://your-app.vercel.app)
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` (if using webhooks)
   - `CLOUDINARY_*` (all three)

7. Deploy. Note the backend URL (e.g. `https://your-api.railway.app`).

## Frontend (Vite/React)

1. Deploy to Vercel/Netlify or use Railway static.
2. Set **Build Command**: `npm run build` (from repo root, so root directory = `.` and build in `client` may need to be `cd client && npm run build` if your host builds from root).
3. Set **Root Directory** to `client` if the platform supports it, then build command is `npm run build`.
4. Add environment variable:
   - `VITE_STRIPE_PUBLISHABLE_KEY`
5. Set **API URL**: In your app you use relative `/api` in dev (proxy). For production, either:
   - Use a reverse proxy so `/api` goes to your backend, or
   - Set `VITE_API_URL=https://your-api.railway.app` and update the client axios baseURL to use it when present.
