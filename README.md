
## Simple app to manage notes in markdown format ##

### install app: ###

Create app.json config file in /config based on example file.

```
$ cd client && npm install
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
$ cd client && ./node_modules/.bin/ng build --prod
```

Open: **http://localhost:9000**
