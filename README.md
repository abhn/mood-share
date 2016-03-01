# MoodShare
Share moods with your friends.

### Installing
```
git clone https://github.com/abhn/mood-share.git
cd mood-share
```
edit all routes and change mongo url
```
npm install
nodejs server.js
```
If all runs fine, deploy it to a public facing cloud.

## API Documentation

### POST /register
* Parameters: ```{ name, username, password }```
* Status: 201 on success, otherwise as stated

### POST /login
* parameters: ```{ username, password }```
* Status: 202 on success, otherwise as stated

### POST /add
* parameters: ```{ username, password, friend }```
* Status: 201 on success, otherwise as stated

### POST /update
* parameters: ```{ username, password, status }```
* Status: 201 on success, otherwise as stated

### POST /list
* parameters: ```{ username, password, friend }```
* Status: 200 with mood list as a JSON object, otherwise as stated

### POST /friends
* parameters: ```{ username, password, friend }```
* Status: 200 with friend list as a json object, otherwise as stated

## HTTP Error Response Codes
* **200** OK
* **201** OBJECT CREATED
* **202** AUTHENTICATION ACCEPTED
* **400** BAD REQUEST
* **401** UNAUTHORIZED
* **404** NOT FOUND
* **405** NOT ALLOWED
* **500** INTERNAL SERVER ERROR
* **600** USERNAME ALREADY EXISTS