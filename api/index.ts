import { app } from "../server/app";
import { registerRoutes } from "../server/routes";

// Initialize routes
registerRoutes(app);

// Add error handling for Vercel
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("API Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message, error: process.env.NODE_ENV === 'development' ? err : undefined });
});

export default app;
