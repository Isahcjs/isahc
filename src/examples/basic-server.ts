
import { createApp, json, urlencoded, Context } from '../index.js';

const app = createApp();

// Middleware
app.use(json());
app.use(urlencoded());

// Routes
app.get('/', (ctx: Context) => {
  ctx.json({ message: 'Hello from isahc!' });
});

app.get('/users/:id', (ctx: Context) => {
  const { id } = ctx.params;
  ctx.json({ userId: id, name: `User ${id}` });
});

app.post('/users', async (ctx: Context) => {
  const body = await ctx.body();
  ctx.status(201).json({ 
    message: 'User created',
    data: body 
  });
});

// Start server
app.listen(5000, () => {
  console.log('Basic server example running!');
});
