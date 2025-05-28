module.exports = {
  apps: [
    {
      name: 'api_portfolio',
      script: 'index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5005
      }
    }
  ]
}