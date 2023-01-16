# node-CRUD-API

## Installation
```bash
git clone git@github.com:AV-63-dev/node-CRUD-API.git

cd ./node-CRUD-API

npm i
```
Set the required port in the .env file
```js
PORT=4000
```

## Start
development mode, single server
```bash
npm run start:dev
```
production mode, single server
```bash
npm run start:prod
```
application tests
```bash
npm run test
```
development mode, multithreaded server + load balancer
```bash
npm run start:multi
```
Attention: Check the operating mode and the server port in the console. In multi mode, information about the responding worker is displayed in the console. Error=500 are displayed in the console.

## Description
Users are stored as `objects` that have following properties:  
    - `id` — unique identifier (`string`, `uuid`) generated on server side  
    - `username` — user's name (`string`, **required**)  
    - `age` — user's age (`number`, **required**)  
    - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)  
    
Implemented endpoint:  
    - **GET** `api/users` is used to get all persons  
    - **GET** `api/users/{userId}` is used to get one user  
    - **POST** `api/users` is used to create record about new user and store it in database. Waiting for the request body with all required fields and not only  
    - **PUT** `api/users/{userId}` is used to update existing user. Waiting for the request body with all required fields and not only  
    - **DELETE** `api/users/{userId}` is used to delete existing user from database  
    
 ## Task - [link](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)