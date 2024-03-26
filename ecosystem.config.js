module.exports = {
  apps: [
    {
      name: "buksu_imd_dms",
      script: "npm", // or 'yarn' if you use Yarn
      args: "run start", // Replace 'start' with your actual start script
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
