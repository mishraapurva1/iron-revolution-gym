export default async function handler(req: any, res: any) {
  try {
    const app = (await import('../server/app')).default;
    return app(req, res);
  } catch (err: any) {
    console.error('Vercel Serverless Function Crash:', err);
    return res.status(500).json({
      error: 'VERCEL_FUNCTION_CRASH',
      message: err?.message || String(err),
      stack: err?.stack,
      envCheck: {
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        hasJwtSecret: Boolean(process.env.JWT_SECRET),
        nodeEnv: process.env.NODE_ENV,
      },
    });
  }
}


