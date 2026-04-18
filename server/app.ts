import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import generalRoutes from './routes/generalRoutes.ts';

const app = express();

app.use(express.json());

// API Routes
app.use('/api', generalRoutes);

// Serve frontend
async function setupFrontend() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupFrontend();

export default app;
