const Koa = require('koa');
const nextjs = require('next');
const Router = require('@koa/router');
const helmet = require('koa-helmet');
const { v4: uuidv4 } = require('uuid');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  router.all('(.*)', async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  const uuid = Buffer.from(uuidv4()).toString('base64');
  const nonce = `nonce-${uuid}`;

  // Create a nonce on every request and make it available to other middleware
  server.use(async (ctx, next) => {
    ctx.state.nonce = nonce;
    await next();
  });

  const scriptSrc = ["'self'", "'unsafe-inline'", 'js-agent.newrelic.com', 'bam.nr-data.net', '*.google-analytics.com', '*.doubleclick.net', 'https:', nonce];
  // In dev we allow 'unsafe-eval', so HMR doesn't trigger the CSP
  if (process.env.NODE_ENV !== 'production') {
    scriptSrc.push("'unsafe-eval'");
  }
  server.use(helmet({
    hsts: {
      includeSubDomains: false,
    },
    contentSecurityPolicy: {
      directives: {
        scriptSrc,
        imgSrc: ['*.gravatar.com', '*.wp.com', '*.opendns.com', '*.google.com', '*.doubleclick.net', '*.google-analytics.com', 'data:'],
        defaultSrc: ["'self'", 'js-agent.newrelic.com', 'bam.nr-data.net'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        baseUri: ["'none'"],
        objectSrc: ["'none'"],
        connectSrc: ["'self'", 'ws:', 'bam.nr-data.net', '*.google-analytics.com', '*.s3.amazonaws.com', '*.doubleclick.net'],
        fontSrc: ["'self'"],
        reportUri: '/report-violation',
      },
    },
    dnsPrefetchControl: false,
  }));

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
