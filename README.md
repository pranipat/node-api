# Prerequisite

To run the project locally you need:
1) Node version 8+
2) NPM
3) Mongo Database runnning locally

To run the project in docker please install:
1) docket
2) docker-compose

# Build Dev

`npm run build-dev`

# Run Dev

`npm run dev`

# Build Production

`npm run build`

# Run Production

`npm run production`

# Test

`npm test`





# Routes

1) signup

POST http://localhost:8080/signup

payload: 

{"firstName":"Joe","surname":"Bloggs","username":"joebloggs","password":"reallysecurepassword"}

2) login

payload: 

{"username":"joebloggs","password":"reallysecurepassword"}

POST http://localhost:8080/login

The response should contain an Authorization header with a valid bearer token like this:

Bearer eyJ0eXAiOiJKV1aiLCJhbGciOiJIUzUxMiJ9.eyJST0xFIjpbIkdFTkVSQUxfVVNFUiJdLCJzdWIiOiI1ZDcyMzejZTBkajQ4ZjAwaDE2MGJdsfIiLCJleHAiOjE1Njg2MjkwODJ9.z4iTtfbE6gIKfxe63o9JC6bVkg9W15fWQtihD3g1uKMoEhLdC9jmw7NIwkbp6uhYJyzns_c_ZMJhLS0Fcy6WZb


3) api/v1/oscar/search

get : year as integer

GET http://localhost:8080/api/v1/oscar/search/2000

This get request should return the results after querying the sample dataset by the year value. This data will look something like this:

[{"id":"5d723088153ae99a19c63312","category":"ACTOR IN A LEADING ROLE","entity":"Javier Bardem","winner":false,"year":2000},{"id":"5d723088153ae99a19c63313","category":"ACTOR IN A LEADING ROLE","entity":"Russell Crowe","winner":true,"year":2000}.......]

4) api/v1/session/isLoggedIn

GET http://localhost:8080/api/v1/session/isLoggedIn 
Pass x-access-token in the header request


- returns {status:true,message:userdetails} if they are logged in.

5) api/v1/session/name

GET http://localhost:8080/api/v1/session/name

Pass x-access-token in the header request
 - returns {status:true,message:firstName} , the first name of the logged in user.