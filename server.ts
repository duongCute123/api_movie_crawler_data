import express from 'express';
import v2 from './version/v2/api';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

// quick health route
app.get('/v2/hello', (req, res) => {
  res.json({ ok: true, message: 'v2 hello' });
});

// Version v2 only
app.use(
  '/v2',
  cors({
    origin: ['https://webcomics-platforms.vercel.app'],
  }),
  v2
);

console.log('V2 router paths:', v2.stack
  .filter((layer: any) => layer.route)
  .map((layer: any) => layer.route.path)
);

// Handle 404
app.use((req, res) => {
  res.json({
    status: 404,
    message: 'Not Found',
  });
});

// @ts-ignore
app.use((err, req, res, next) => {
  const status = +(err.message.match(/\d+/) || 500);
  res.status(status).json({
    status,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

export = app;
