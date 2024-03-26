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

# PuTTY

Below is a step-by-step guide on how to use PuTTY to access an Ubuntu server that's configured with a custom SSH port:

_Take note that the server may be blocking some networks try changing networks when experiencing problems. It is also worth noting that when connecting via ssh, use the ip address not the subdomain_

1. **Download PuTTY**:

   - If you haven't already, download PuTTY from the official website: [PuTTY Download Page](https://www.putty.org/).

2. **Install PuTTY**:

   - Once downloaded, run the installer and follow the installation instructions.

3. **Open PuTTY**:

   - After installation, open PuTTY by double-clicking the PuTTY icon.

4. **Enter Connection Information**:

   - In the "Host Name (or IP address)" field, enter the IP address or hostname of your Ubuntu server.
   - Enter the custom SSH port number in the "Port" field. By default, SSH uses port 22, so make sure to enter the custom port if it's different.
   - Ensure that the connection type is set to "SSH".

5. **Save the Session** (Optional):

   - If you plan to connect to this server frequently, you can save the session settings by entering a name under "Saved Sessions" and clicking the "Save" button. This allows you to quickly load these settings in the future.

6. **Configure SSH Options** (Optional):

   - You can configure additional SSH options by navigating to the "Connection" -> "SSH" category in the left panel. Here you can set options like SSH keepalive intervals, preferred SSH authentication methods, etc.

7. **Connect**:

   - Click the "Open" button at the bottom of the PuTTY window to initiate the connection.

8. **Authenticate**:

   - Once the connection is established, PuTTY will prompt you for your username. Enter the username for your Ubuntu server and press Enter.
   - Next, PuTTY will prompt you for your password. Type your password (Note: Password characters won't be displayed for security reasons) and press Enter.

9. **Terminal Session**:

   - If everything is configured correctly, you should now have access to the command-line interface of your Ubuntu server via PuTTY.

10. **Close Connection**:

    - To close the connection, simply type `exit` and press Enter in the PuTTY terminal window, or click the close button at the top right corner of the PuTTY window.

That's it! You've successfully connected to your Ubuntu server using PuTTY with a custom SSH port. You can now manage your server via the command line.

# How to Run on a Server

1. **Clone github repository**
   ```
   user@server:~$ git clone <SSH>
   ```
2. **Install npm packages**
   ```
   user@server:~$ cd buksu_imd_dmsv2
   user@server:~$ npm i
   ```
3. **Install and Setup PostgreSQL**

   See PostgreSQL section for info.

4. **Add .env file**

   _This should be given to you_ and place it on the main directory of the project.

5. **Migrate prisma database**

   ```
   user@server:~$ npx prisma migrate dev
   ```

6. **Build the Web App**

   ```
   user@server:~$ npm run build
   ```

7. **Start the Web App**

   ```
   user@server:~$ npm run start
   ```

# PostgreSQL

1. **Installing PostgreSQL**

   To install PostgreSQL, first refresh your server’s local package index:

   ```
   $ sudo apt update
   ```

   Then, install the Postgres package along with a -contrib package that adds some additional utilities and functionality:

   ```
   $ sudo apt install postgresql postgresql-contrib
   ```

   Press Y when prompted to confirm installation. If you are prompted to restart any services, press ENTER to accept the defaults and continue.

2. **Using PostgreSQL Roles and Databases**

   By default, Postgres uses a concept called “roles” to handle authentication and authorization. These are, in some ways, similar to regular Unix-style users and groups.

   Upon installation, Postgres is set up to use ident authentication, meaning that it associates Postgres roles with a matching Unix/Linux system account. If a role exists within Postgres, a Unix/Linux username with the same name is able to sign in as that role.

   The installation procedure created a user account called postgres that is associated with the default Postgres role. There are a few ways to utilize this account to access Postgres. One way is to switch over to the postgres account on your server by running the following command:

   ```
   $ sudo -i -u postgres
   ```

   Then you can access the Postgres prompt by running:

   ```
   $ psql
   ```

   This will log you into the PostgreSQL prompt, and from here you are free to interact with the database management system right away.

   To exit out of the PostgreSQL prompt, run the following:

   ```
   postgres=# \q
   ```

   This will bring you back to the postgres Linux command prompt. To return to your regular system user, run the exit command:

   ```
   postgres@server:~$ exit
   ```

   Another way to connect to the Postgres prompt is to run the psql command as the postgres account directly with sudo:

   ```
   $ sudo -u postgres psql
   ```

   This will log you directly into Postgres without the intermediary bash shell in between.

   Again, you can exit the interactive Postgres session by running the following:

   ```
   postgres=# \q
   ```

3. **Creating a New Role**

   If you are logged in as the **postgres** account, you can create a new role by running the following command:

   ```
   postgres@server:~$ createuser --interactive
   ```

   If, instead, you prefer to use sudo for each command without switching from your normal account, run:

   ```
   $ sudo -u postgres createuser --interactive
   ```

   Either way, the script will prompt you with some choices and, based on your responses, execute the correct Postgres commands to create a user to your specifications.

   ```
   Output
   Enter name of role to add: sammy
   Shall the new role be a superuser? (y/n) y
   ```

4. **Creating a New Database**

   Another assumption that the Postgres authentication system makes by default is that for any role used to log in, that role will have a database with the same name which it can access.

   This means that if the user you created in the last section is called **sammy**, that role will attempt to connect to a database which is also called “sammy” by default. You can create the appropriate database with the createdb command.

   If you are logged in as the **postgres** account, you would type something like the following:

   ```
   postgres@server:~$ createdb sammy
   ```

   If, instead, you prefer to use sudo for each command without switching from your normal account, you would run:

   ```
   $ sudo -u postgres createdb sammy
   ```

5. **Opening a Postgres Prompt with the New Role**

   To log in with ident based authentication, you’ll need a Linux user with the same name as your Postgres role and database.

   If you don’t have a matching Linux user available, you can create one with the adduser command. You will have to do this from your non-**root** account with sudo privileges (meaning, not logged in as the **postgres** user):

   ```
   $ sudo adduser sammy
   ```

   Once this new account is available, you can either switch over and connect to the database by running the following:

   ```
   $ sudo -i -u sammy
   $ psql
   ```

   Or, you can do this inline:

   ```
   $ sudo -u sammy psql
   ```

   This command will log you in automatically, assuming that all of the components have been properly configured.

   If you want your user to connect to a different database, you can do so by specifying the database like the following:

   ```
   $ psql -d postgres
   ```

   Once logged in, you can get check your current connection information by running:

   ```
   sammy=# \conninfo
   ```

   ```
   Output
   You are connected to database "sammy" as user "sammy" via socket in "/var/run/postgresql" at port "5432".
   ```

_The web app will now be running on localhost:3000 however this will not be accessible to the users. We must run it on port 80 in order for the user to access we do that by using nginx._

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

_The web app will now be accessible to the users however it will shutdown if the putty session is closed_

# PM2

To start a Next.js web application using PM2 on an Ubuntu server, you'll need to ensure that you have Node.js, npm, and PM2 installed on your server. Additionally, assuming you have already configured your Next.js application's ecosystem file for PM2, here's a step-by-step instruction:

1. **SSH into Your Ubuntu Server**: Connect to your Ubuntu server using SSH.

2. **Navigate to Your Next.js Application Directory**: Use the `cd` command to move to the directory where your Next.js application is located.

3. **Install PM2 (if not already installed)**: If PM2 is not installed on your server, you can install it globally using npm with the following command:

   ```
   npm install pm2 -g
   ```

4. **Start Your Next.js Application with PM2**: Once PM2 is installed, you can start your Next.js application using the ecosystem file you've configured. Assuming your ecosystem file is named `ecosystem.config.js`, you can start your application with PM2 using the following command:

   ```
   pm2 start ecosystem.config.js
   ```

5. **Verify Application Status**: To ensure that your application is running correctly, you can check its status with PM2:

   ```
   pm2 status
   ```

6. **(Optional) Set Up PM2 Startup Script**: If you want your Next.js application to automatically start when the server reboots, you can generate a startup script for PM2:

   ```
   pm2 startup
   ```

   Follow the instructions provided by PM2 to set up the startup script. Once done, your Next.js application will automatically start when the server boots.

That's it! Your Next.js application should now be running using PM2 on your Ubuntu server. You can access it through the specified port or domain, depending on your configuration.

**The web app is now available to the users.**
