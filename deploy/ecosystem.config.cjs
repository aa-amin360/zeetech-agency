// PM2 process file:  pm2 start deploy/ecosystem.config.cjs  (run from the project folder)
module.exports = {
  apps: [
    {
      name: 'zeetech',
      cwd: __dirname + '/..',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000 -H 127.0.0.1',
      env: { NODE_ENV: 'production', NODE_OPTIONS: '--no-deprecation' },
      // one process: the rate limiter and upload handling are in-memory
      instances: 1,
      max_memory_restart: '1G',
      time: true,
    },
  ],
}
