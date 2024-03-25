This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Project Specifics

## Color Palette

![#152033](https://placehold.co/15x15/152033/152033.png) `#152033 (Dark Blue)`<br/>
![#E1EFFE](https://placehold.co/15x15/E1EFFE/E1EFFE.png) `#E1EFFE (Pattens Blue)`<br/>
![#F2C050](https://placehold.co/15x15/F2C050/F2C050.png) `#F2C050 (Orange)`<br/>
![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) `#FFFFFF (White)`<br/>
![#717883](https://placehold.co/15x15/717883/717883.png) `#717883 (Gray)`<br/>

# Tools used:

See package.json for more info

1. Prisma
2. Postgresql
3. nginx
4. pm2
5. Next-auth

# NGINX Setup

To use Nginx to solve the "EACCES: permission denied" problem when running your Next.js application on an Ubuntu server, you can configure Nginx as a reverse proxy to forward requests from port 80 to the port your Next.js application is running on. Here's how you can do it:

1. **Install Nginx**: If you haven't already installed Nginx, you can do so by running:

   ```
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx**: Create a new configuration file for your Next.js application in the `/etc/nginx/sites-available/` directory. For example, you can name it `nextjs.conf`.

   ```
   sudo nano /etc/nginx/sites-available/nextjs.conf
   ```

   Add the following configuration to the file:

   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://localhost:3000; # Change the port if your Next.js app is running on a different port
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Replace `your_domain.com` with your actual domain name or IP address. Ensure that `proxy_pass` points to the correct port where your Next.js application is running (in this example, it's assuming it's running on port 3000).

3. **Enable the Configuration**: Create a symbolic link to enable the site configuration by running:

   ```
   sudo ln -s /etc/nginx/sites-available/nextjs.conf /etc/nginx/sites-enabled/
   ```

4. **Test Nginx Configuration**: Before restarting Nginx, it's a good practice to test the configuration to ensure there are no syntax errors:

   ```
   sudo nginx -t
   ```

   If the test is successful, you should see `syntax is okay` and `test is successful`.

5. **Restart Nginx**: Once the configuration is tested and there are no errors, restart Nginx to apply the changes:

   ```
   sudo systemctl restart nginx
   ```

6. **Check Nginx Status**: Verify that Nginx is running without errors:

   ```
   sudo systemctl status nginx
   ```

   If Nginx is running correctly, you should see a message indicating that it's active and running.

After following these steps, Nginx should be configured to forward requests to your Next.js application, allowing it to listen on port 80 without requiring root privileges.
