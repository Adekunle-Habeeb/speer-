const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Replace with the actual entry file of your application
const User = require('../models/userModel'); // Replace with your actual path
const Notes = require('../models/noteModel'); 
const { generateToken } = require('../config/generateToken'); // Replace with your actual path

chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication API', () => {
  beforeEach(async () => {

    // Clear the user collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        username: 'john_doe',
      };

      const res = await chai.request(app)
        .post('/api/auth/signup')
        .send(newUser);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('firstName', newUser.firstName);
      expect(res.body).to.have.property('lastName', newUser.lastName);
      expect(res.body).to.have.property('email', newUser.email);
      expect(res.body).to.have.property('username', newUser.username);
      expect(res.body).to.have.property('token');
    });

    it('should return an error if required fields are missing', async () => {
      const incompleteUser = {
        firstName: 'John',
        lastName: 'Doe',
        // Missing other required fields
      };

      const res = await chai.request(app)
        .post('/api/auth/signup')
        .send(incompleteUser);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('msg', 'All fields are required');
    });

    // Add more signup test cases as needed
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate a user with valid credentials', async () => {
      // Assume a user is registered before this test
      const existingUser = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password456',
        username: 'jane_doe',
      };

      await User.create(existingUser);

      const credentials = {
        username: existingUser.username,
        password: existingUser.password,
      };

      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('firstName', existingUser.firstName);
      expect(res.body).to.have.property('lastName', existingUser.lastName);
      expect(res.body).to.have.property('email', existingUser.email);
      expect(res.body).to.have.property('username', existingUser.username);
      expect(res.body).to.have.property('token');
    });

    it('should return an error for invalid credentials', async () => {
      const invalidCredentials = {
        username: 'nonexistent_user',
        password: 'invalid_password',
      };

      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('msg', 'Invalid Username or Password');
    });

    // Add more login test cases as needed
  });



  // Add more authentication test cases (e.g., testing token expiration, middleware checks, etc.)
});


describe('Notes API', () => {
  let authToken; // To store the authentication token

  beforeEach(async () => {
    // Clear the user collection before each test
    await User.deleteMany({});

    // Register a user and get the authentication token
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      username: 'john_doe',
    };

    const res = await chai.request(app)
      .post('/api/auth/signup')
      .send(newUser);

    authToken = res.body.token;
  });

  describe('GET /api/notes', () => {
    it('should retrieve all notes for the authenticated user', async () => {
      const res = await chai.request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      // Add more expectations based on your specific response structure
    });
  });

});

describe('POST /api/notes', () => {
  let authToken; // To store the authentication token

  beforeEach(async () => {
    // Clear the user collection before each test
    await User.deleteMany({});

    // Register a user and get the authentication token
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      username: 'john_doe',
    };

    const res = await chai.request(app)
      .post('/api/auth/signup')
      .send(newUser);

    authToken = res.body.token;
  });

  it('should create a new note', async () => {
    const newNote = {
      title: 'New Note Title',
      content: 'New Note Content',
    };

    const res = await chai.request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newNote);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('title', newNote.title);
    expect(res.body).to.have.property('content', newNote.content);

    // Adjust the expectation based on your user authentication setup
    expect(res.body).to.have.property('createdBy');

    // Alternatively, if you have the user's username:
    // expect(res.body).to.have.property('createdBy', req.user.username);
  });

  // it('should return an error if required fields are missing', async () => {
  //   const missingNote = {
  //     title: '',
  //     content: '',
  //   };

  //   const res = await chai.request(app)
  //     .post('/api/notes')
  //     .set('Authorization', `Bearer ${authToken}`)
  //     .send(missingNote);

  //   expect(res).to.have.status(400);
  //   expect(res.body).to.have.property('msg', 'Title and Content are required');
  // });

  // Add more create note test cases as needed
});


describe('Notes API', () => {
  let authToken; // To store the authentication token

  beforeEach(async () => {
    // Clear the user and notes collections before each test
    await User.deleteMany({});
    await Notes.deleteMany({});

    // Register a user and get the authentication token
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      username: 'john_doe',
    };

    const res = await chai.request(app)
      .post('/api/auth/signup')
      .send(newUser);

    authToken = res.body.token;
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note for the authenticated user', async () => {
      // Create a note to update
      const newNote = {
        title: 'Test Note Title',
        content: 'Test Note Content',
      };

      const createNoteResponse = await chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newNote);

      const noteIdToUpdate = createNoteResponse.body._id;

      // Update the note
      const updatedNote = {
        title: 'Updated Note Title',
        content: 'Updated Note Content',
      };

      const updateNoteResponse = await chai.request(app)
        .put(`/api/notes/${noteIdToUpdate}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedNote);

      expect(updateNoteResponse).to.have.status(200);
      expect(updateNoteResponse.body).to.have.property('_id', noteIdToUpdate);
      expect(updateNoteResponse.body).to.have.property('title', updatedNote.title);
      expect(updateNoteResponse.body).to.have.property('content', updatedNote.content);
    });

    // it('should return an error if the note to update is not found', async () => {
    //   const nonExistingNoteId = 'nonexistingnoteid';

    //   const updatedNote = {
    //     title: 'Updated Note Title',
    //     content: 'Updated Note Content',
    //   };

    //   const updateNoteResponse = await chai.request(app)
    //     .put(`/api/notes/${nonExistingNoteId}`)
    //     .set('Authorization', `Bearer ${authToken}`)
    //     .send(updatedNote);

    //   expect(updateNoteResponse).to.have.status(404);
    //   expect(updateNoteResponse.body).to.have.property('message', 'Note not found');
    // });
  });
});


describe('Notes API', () => {
  let authToken; // To store the authentication token

  beforeEach(async () => {
    // Clear the user and notes collections before each test
    await User.deleteMany({});
    await Notes.deleteMany({});

    // Register a user and get the authentication token
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      username: 'john_doe',
    };

    const res = await chai.request(app)
      .post('/api/auth/signup')
      .send(newUser);

    authToken = res.body.token;
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note for the authenticated user', async () => {
      // Create a note to delete
      const newNote = {
        title: 'Test Note Title',
        content: 'Test Note Content',
      };

      const createNoteResponse = await chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newNote);

      const noteIdToDelete = createNoteResponse.body._id;

      // Delete the note
      const deleteNoteResponse = await chai.request(app)
        .delete(`/api/notes/${noteIdToDelete}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteNoteResponse).to.have.status(200);
      expect(deleteNoteResponse.body).to.have.property('message', 'Note deleted');

      // Verify that the note has been deleted from the database
      const deletedNote = await Notes.findById(noteIdToDelete);
      expect(deletedNote).to.be.null;
    });

    // it('should return an error if the note to delete is not found', async () => {
    //   const nonExistingNoteId = 'nonexistingnoteid';

    //   const deleteNoteResponse = await chai.request(app)
    //     .delete(`/api/notes/${nonExistingNoteId}`)
    //     .set('Authorization', `Bearer ${authToken}`);

    //   expect(deleteNoteResponse).to.have.status(404);
    //   expect(deleteNoteResponse.body).to.have.property('message', 'Note not found');
    // });
  });
});


describe('Notes API', () => {
  let authToken; // To store the authentication token
  let otherUserAuthToken; // To store the authentication token for another user

  beforeEach(async () => {
    // Clear the user and notes collections before each test
    await User.deleteMany({});
    await Notes.deleteMany({});

    // Register a user and get the authentication token
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      username: 'john_doe',
    };

    const res = await chai.request(app)
      .post('/api/auth/signup')
      .send(newUser);

    authToken = res.body.token;

    // Register another user and get the authentication token
    const otherUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: 'password456',
      username: 'jane_doe',
    };

    const otherUserRes = await chai.request(app)
      .post('/api/auth/signup')
      .send(otherUser);

    otherUserAuthToken = otherUserRes.body.token;
  });

  describe('POST /api/notes/:id/share', () => {
    it('should share a note with another user', async () => {
      // Create a note to share
      const newNote = {
        title: 'Test Note Title',
        content: 'Test Note Content',
      };

      const createNoteResponse = await chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newNote);

      const noteIdToShare = createNoteResponse.body._id;

      // Share the note with another user
      const userToShareWith = await User.findOne({ username: 'jane_doe' });

      const shareNoteResponse = await chai.request(app)
        .post(`/api/notes/${noteIdToShare}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userIdToShareWith: userToShareWith._id });

      expect(shareNoteResponse).to.have.status(200);
      expect(shareNoteResponse.body).to.have.property('message', 'Note shared successfully');
    });

    // it('should return an error if the note or user is not found or unauthorized', async () => {
    //   // Create a note to share
    //   const newNote = {
    //     title: 'Test Note Title',
    //     content: 'Test Note Content',
    //   };

    //   const createNoteResponse = await chai.request(app)
    //     .post('/api/notes')
    //     .set('Authorization', `Bearer ${authToken}`)
    //     .send(newNote);

    //   const noteIdToShare = createNoteResponse.body._id;

    //   // Attempt to share the note with an unauthorized user
    //   const unauthorizedUserId = 'nonexistentuserid';

    //   const shareNoteResponse = await chai.request(app)
    //     .post(`/api/notes/${noteIdToShare}/share`)
    //     .set('Authorization', `Bearer ${unauthorizedUserId}`)
    //     .send({ userIdToShareWith: unauthorizedUserId });

    //   expect(shareNoteResponse).to.have.status(404);
    //   expect(shareNoteResponse.body).to.have.property('message', 'Note or user not found, or unauthorized');
    // });
  });
});


const sinon = require('sinon'); // Add this import statement at the top of your test file

describe('Notes API', () => {
  let authToken; // To store the authentication token

  beforeEach(async () => {
    // Clear the user and notes collections before each test
    await User.deleteMany({});
    await Notes.deleteMany({});

    // Register a user and get the authentication token
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      username: 'john_doe',
    };

    const res = await chai.request(app)
      .post('/api/auth/signup')
      .send(newUser);

    authToken = res.body.token;
  });

  describe('GET /api/search', () => {
    it('should search notes for the authenticated user', async () => {
      // Create notes for the user
      const newNote1 = {
        title: 'Test Note Title 1',
        content: 'Test Note Content 1',
      };
    
      const newNote2 = {
        title: 'Test Note Title 2',
        content: 'Test Note Content 2',
      };
    
      await chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newNote1);
    
      await chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newNote2);
    
      // Search for notes
      const searchQuery = 'Test Note Title 1';
      const searchResponse = await chai.request(app)
        .get(`/api/search?q=${searchQuery}`)
        .set('Authorization', `Bearer ${authToken}`);
    
      expect(searchResponse).to.have.status(200);
      expect(searchResponse.body).to.be.an('array');
    
      // Modify the assertion to check that at least one note is returned
      expect(searchResponse.body.length).to.be.at.least(1);
    
      // Optionally, you can assert specific properties of the first note in the array
      expect(searchResponse.body[0]).to.have.property('title', newNote1.title);
      expect(searchResponse.body[0]).to.have.property('content', newNote1.content);
    });
    

    it('should return an error if no notes are found', async () => {
      // Search for non-existing notes
      const searchQuery = 'Non-Existing Note';
      const searchResponse = await chai.request(app)
        .get(`/api/search?q=${searchQuery}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(searchResponse).to.have.status(404);
      expect(searchResponse.body).to.have.property('message', 'No notes found');
    });

    it('should return an error for internal server error during search', async () => {
      // Simulate an internal server error during the search
      sinon.stub(Notes, 'find').throws(new Error('Internal Server Error'));

      const searchQuery = 'Test Note Title';
      const searchResponse = await chai.request(app)
        .get(`/api/search?q=${searchQuery}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(searchResponse).to.have.status(500);
      expect(searchResponse.body).to.have.property('message', 'Error searching notes');

      // Restore the original behavior of the 'find' method after the test
      Notes.find.restore();
    });
  });
});

const { Types } = require('mongoose');

describe('Notes API', () => {
  let authToken; // To store the authentication token

  beforeEach(async () => {
    // Clear the user and notes collections before each test
    await User.deleteMany({});
    await Notes.deleteMany({});

    // Register a user and get the authentication token
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      username: 'john_doe',
    };

    const res = await chai.request(app)
      .post('/api/auth/signup')
      .send(newUser);

    authToken = res.body.token;
  });

  // describe('GET /api/notes/:id', () => {
  //   it('should return an error if the note is not found for the authenticated user', async () => {
  //     // Create a note for the user
  //     const newNote = {
  //       title: 'Test Note Title',
  //       content: 'Test Note Content',
  //     };

  //     const createNoteResponse = await chai.request(app)
  //       .post('/api/notes')
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .send(newNote);

  //     const noteId = createNoteResponse.body._id;

  //     // Attempt to retrieve a non-existing note by providing an invalid ObjectId
  //     const nonExistingNoteId = 'nonexistentnoteid';

  //     const invalidObjectId = Types.ObjectId.isValid(nonExistingNoteId)
  //       ? nonExistingNoteId
  //       : Types.ObjectId; // Remove the invocation

  //     const getNoteResponse = await chai.request(app)
  //       .get(`/api/notes/${invalidObjectId}`)
  //       .set('Authorization', `Bearer ${authToken}`);

  //     expect(getNoteResponse).to.have.status(404);
  //     expect(getNoteResponse.body).to.have.property('message', 'Note not found');
  //   });
  
});
