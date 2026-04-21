import express from 'express';
import cartRoutes from './routes/cartRoutes';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/carts', cartRoutes);

export default app;
