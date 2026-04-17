module.exports = {
  apps: [
    {
      name: "blogmmo",
      cwd: "/var/www/blogmmo/current",
      script: "npm",
      args: "run start -- --port 3000",
      env: {
        NODE_ENV: "production",
      },
      max_restarts: 10,
      min_uptime: "10s",
      autorestart: true,
    },
  ],
};
