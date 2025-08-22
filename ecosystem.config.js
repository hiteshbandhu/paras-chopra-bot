module.exports = {
  apps: [
    {
      name: 'ai-chatbot',
      script: 'pnpm',
      args: 'start',
      cwd: '/var/www/ai-chatbot',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NODE_OPTIONS: '--max-old-space-size=4096',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NODE_OPTIONS: '--max-old-space-size=4096',
      },
      error_file: '/var/log/pm2/ai-chatbot-error.log',
      out_file: '/var/log/pm2/ai-chatbot-out.log',
      log_file: '/var/log/pm2/ai-chatbot-combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.git'],
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
