#API Endpoints for dmsMongoose
- '/documents'
  -  POST to create documents
  -  GET to retrieve all Documents

- '/documents/:doc_id'
  -  GET to retrieve document with id:'doc_id'
  -  PUT to update document with id:'doc_id'
  -	 DELETE to delete document with id:'doc_id'

- '/users/:u_id/documents'
  -  GET TO retrieve all docs for user with id:'u_id'

- '/users'
  -  POST to create user
  _  GET to retrieve all users

- '/users/login'
  -  POST to authenticate and get token
  
-  '/users/:u_id'
  -  GET to retrieve current user details
  -  PUT to edit current user details
  -  DELETE to delete user from db