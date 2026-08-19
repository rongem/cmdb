# Installation Guide
The installation of this multi tier application needs a little bit developer experience and a visual studio IDE.

## 1. Database setup
Create a MongoDB database in your network or with a cloud provider. The database name is up to you. 

## 2. Application setup
Create an .env file and add the following variables:
 * MONGODB_URI: The connections string from the MongoDB 
 * AUTH_MODE: Set it to either `jwt` or `ntlm`.
If you set it to jwt, also set two other environment variables:
 * JWT_SERVER_KEY: Set it to a server secret.
 * SALT: Set it to a value between 12 and 16. Higher salt values are more secure, but take longer for encrypting the password (12 = 500 ms, 15 = 2 s).
If you set the environment variable AUTH_MODE to ntlm, you need a windows Server to run the application on, and docker won't work.

With a pre-installed docker, start a console, change to the projects root directory and execute `docker-compose --env-file <path-to-your-envfile up --build`. Start a browser and open http://localhost for cmdb or http://localhost/dcman for dcman.

If you want to set up the application on your own, follow these instructions:

### a. Backend setup

If you are unfamiliar with NodeJS:
Use NodeJS and deploy the build directory.

### b. Frontend Setup
1. Run `ng build backend-access --prod`
2. Run `ng build --prod cmdb` for cmdb or `ng build --prod dcman` for DCMan; if you want to use the provided English translation, use `--configuration=production,en` instead of `--prod`
3. Take the files from the dist/cmdb or dist/dcman folder and put them to the directory of your choice in the web server. Both applications can be run side by side.
4. Edit the file `assets/config/config.production.json` and adjust the backend url to the backend on IIS.
5. Create one or more users with the role Administrator so that the security mechanisms take place.

The GUI of cmdb is in German, but prepared for translating. An English translation for every phrase is enclosed in i18n attributes. Use Angular i18n features to create your own localized version. DCMan is completely written in English.

You can also use the docker images on [[https://hub.docker.com/repository/docker/rongem/cmdb]]

