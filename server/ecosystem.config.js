module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'dist/index.js',
        instances: 'max',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'development',
          PORT: 4000,
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 4000,
        },
      },
    ],
  };
  