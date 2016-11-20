
## Simple app to manage notes in markdown format ##

### install app: ###

Create app.json config file in /config based on example file.

```
$ cd client_new && npm install
```

### dev ###
```
$ set /config/app.json - loginRequired: false
$ nodemon app.js
$ npm run frontend_dev // runs ng serve with proxy to api
```
Open **http://localhost:4200**

### build ###

```
$ set /config/app.json - loginRequired: true
$ nodemon app.js
$ cd client_new && ng build --prod
```

Open: **http://localhost:9000**

###### [deprecated] deploy: #######
* `/client/app`
* `/client/partials`
* `/client/index.ejs`
* `/client/login.ejs`
* `/server`
* `/config/app.prod.json`
* `/config/passport.js`
* `/scripts`
* `app.js`
* `package.json`
