TABLE OF CONTENTS 

- REASON I CHOSE Node.js, Express and Mongodb
- HOW TO RUN THE CODE
- BASE ENDPOINTS
- USER ENDPOINTS 
- NOTES ENDPOINTS 
- MANUAL TESTING 





The software is written in Node.js using the Express.js framework for its simplicity, middleware support, and widespread adoption. MongoDB, a NoSQL database, is employed for flexibility and scalability, with Mongoose serving as an Object Data Modeling (ODM) tool to facilitate data modeling. The use of jsonwebtoken enhances security by providing middleware for token-based authentication, while bcrypt is utilized for password hashing, contributing to the overall security of the application. The inclusion of `express-async-handler` simplifies asynchronous route handling, enabling the use of `async/await` syntax for improved code readability and error handling.



HOW TO RUN THE CODE

To run the provided code, follow these steps:

Prerequisites:
Node.js and npm installed on your machine.
MongoDB installed 


1. Clone the Repository:

    git clone <repository-url>
    cd <repository-folder>


2. Install Dependencies:

    npm install


3. Set Up Environment Variables:

    Create a .env file in the project root.
    copy and paste the below in the .env file

    JWT_SECRET=thisismylittlesecret
    MONGO_URL=mongodb+srv://bnaqeeliy:xvC3DOnbDYZyYxaq@cluster0.x2cexle.mongodb.net/?retryWrites=true&w=majority


4. Run the Application:
    npm start


5. Test the endpoints:

    npm test
    

BASE ENDPOINTS - localhost:3000


USER ENDPOINTS:

Signup: POST /api/auth/signup
Login: POST /api/auth/login


NOTES ENDPOINTS:

Get all notes: GET /api/notes
Get notes by ID: GET /api/notes/:id
Create notes: POST /api/notes
Update notes by ID: PUT /api/notes/:id
Delete notes by ID: DELETE /api/notes/:id
Share notes: POST /api/notes/:id/share
Search notes with keyword: GET /api/search/




MANUAL TESTING 

Tips: 

Ensure that the server is running and the database is accessible.
Use a tool like Postman or cURL for sending HTTP requests.
Check the response body and status code for each scenario.



SIGNUP: POST /api/auth/signup

 Request Format:
Method: POST
Headers:
Content-Type: application/json
Example:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "username": "john_doe"
}


Response Format:
Success Response (Status Code: 200):
Example:
{
  "_id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "email": "john.doe@example.com",
  "token": "generated_token"
}

Error Responses:
Status Code: 400
{ "msg": "All fields are required" }
{ "msg": "Account already exists" }
Status Code: 500
{ "msg": "Registration failed" }



LOGIN: POST /api/auth/login

. Request Format:
Method: POST
Headers:
Content-Type: application/json
Example:
{
  "username": "john_doe",
  "password": "password123"
}


Response Format:
Success Response (Status Code: 200):
Example:
{
  "_id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "email": "john.doe@example.com",
  "token": "generated_token"
}

Error Response (Status Code: 400):
Example:
{ "msg": "Invalid Username or Password" }





GET ALL NOTES: GET /api/notes

 Request Format:
Method: GET
Headers:
Authorization: Bearer <token> (Include the user's authentication token)
Example:
No request body is required for this endpoint.
Response Format:
Success Response (Status Code: 200):
Example:
[
  {
    "_id": "note_id_1",
    "title": "Note 1",
    "content": "Content of Note 1",
    "createdBy": "user_id",
    "createdAt": "timestamp"
  },
  {
    "_id": "note_id_2",
    "title": "Note 2",
    "content": "Content of Note 2",
    "createdBy": "user_id",
    "createdAt": "timestamp"
  },
  // Additional notes...
]

Error Response (Status Code: 500):
Example:
{ "message": "Error retrieving notes" }




GET NOTES BY ID: GET /api/notes/:id


Request Format:
Method: GET
Headers:
Authorization: Bearer <token> (Include the user's authentication token)
URL Parameters:
id: The unique identifier of the note to be retrieved.
Example:
No request body is required for this endpoint.
Response Format:
Success Response (Status Code: 200):
Example:

{
  "_id": "note_id",
  "title": "Note Title",
  "content": "Content of the Note",
  "createdBy": "user_id",
  "createdAt": "timestamp"
}

Error Response (Status Code: 404):
Example:
{ "message": "Note not found" }






CREATE NOTES: POST /api/notes


 Request Format:
Method: POST
Headers:
Authorization: Bearer <token> (Include the user's authentication token)
title (String): Title of the note.
content (String): Content of the note.
Example:
{
  "title": "New Note Title",
  "content": "Content of the new note"
}
Response Format:
Success Response (Status Code: 201):
Example:
{
  "_id": "note_id",
  "title": "New Note Title",
  "content": "Content of the new note",
  "createdBy": "user_id",
  "createdAt": "timestamp"
}
Error Response (Status Code: 400):
Example:
{ "message": "Title and Content are required" }
Error Response (Status Code: 500):
Example:
{ "message": "Error creating note" }






UPDATE NOTES ID: PUT /api/notes/:id


Method: PUT
Headers:
Authorization: Bearer <token> (Include the user's authentication token)
Body:

title (String): Updated title of the note.
content (String): Updated content of the note.
Example:

{
  "title": "Updated Note Title",
  "content": "Updated content of the note"
}


Response Format:
Success Response (Status Code: 200):
Example:
{
  "_id": "note_id",
  "title": "Updated Note Title",
  "content": "Updated content of the note",
  "createdBy": "user_id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
Error Response (Status Code: 404):
Example:
{ "message": "Note not found" }
Error Response (Status Code: 500):
Example:
{ "message": "Error updating note" }





DELETE NOTES BY ID: DELETE /api/notes/:id


 Request Format:
Method: DELETE
Headers:
Authorization: Bearer <token> (Include the user's authentication token)
Example:
None
Response Format:
Success Response (Status Code: 200):
Example:
{ "message": "Note deleted" }
Error Response (Status Code: 404):
Example:
{ "message": "Note not found" }
Error Response (Status Code: 500):
Example:
{ "message": "Error deleting note" }







SHARE NOTES: POST /api/notes/:id/share


 Request Format:
Method: POST
Headers:
Authorization: Bearer <token> (Include the user's authentication token)
Body:
userIdToShareWith: string (ID of the user to share the note with)
Example:
{
  "userIdToShareWith": "user_id_to_share_with"
}
 Response Format:
Success Response (Status Code: 200):
Example:
{ "message": "Note shared successfully" }
Error Response (Status Code: 404):
Example:
{ "message": "Note or user not found, or unauthorized" }
Error Response (Status Code: 500):
Example:
{ "message": "Error sharing note" }





SEARCH NOTES WITH KEYWORD: GET /api/search/


Request Format:
Method: GET
Headers:
Authorization: Bearer <token> (Include the user's authentication token)
Query Parameter:
q: string (The search query)
Example:
GET /api/search?q=example
Response Format:
Success Response (Status Code: 200):
Example:
[
  {
    "_id": "note_id_1",
    "title": "Note Title 1",
    "content": "Note Content 1",
    "createdBy": "user_id",
    "createdAt": "timestamp"
  },
  {
    "_id": "note_id_2",
    "title": "Note Title 2",
    "content": "Note Content 2",
    "createdBy": "user_id",
    "createdAt": "timestamp"
  },
  ...
]
Error Response (Status Code: 404):
Example:
{ "message": "No notes found" }
Error Response (Status Code: 500):
Example:
{ "message": "Error searching notes" }












