module.exports = {
  apps: [
    {
      name: "buksu_imd_dms",
      script: "npm", // or 'yarn' if you use Yarn
      args: "run start", // Replace 'start' with your actual start script
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
