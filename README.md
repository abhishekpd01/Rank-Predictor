# Rank-Predictor
This project is a Node.js/Express/MongoDB backend for a quiz application. The application supports:

- **User Registration & Login:** Users can register and (optionally) log in.
- **Quiz Attempt:** Registered users can fetch quizzes, submit their responses, and receive a score.
- **Performance Analysis:** The backend analyzes the user's last five quiz submissions, highlights weak topics, and predicts their NEET rank using past NEET exam results and quiz performance.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Populating Sample Data](#populating-sample-data)

## Features

- **User Registration:** Create an account with name, email, password, and past NEET score.
- **User Authentication:** (Basic authentication provided – can be extended with JWT).
- **Quiz Retrieval:** Fetch quizzes from MongoDB.
- **Quiz Submission:** Submit quiz responses and get a computed score.
- **Performance Analysis:** View average score, weak topics (with performance below 60%), and predicted NEET rank based on a composite score.

## Tech Stack

- **Node.js & Express:** Server and API framework.
- **MongoDB:** Database for storing users, quizzes, and quiz submissions.
- **Mongoose:** ODM for MongoDB.
- **dotenv:** Manage environment variables.
- **bcryptjs:** Password hashing.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/quiz-app-backend.git
   cd quiz-app-backend
2. **Install dependencies:**

   ```bash
   npm install
## Configuration
1. **Create a .env file in the root directory and add the following configuration:**

   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/quiz-app
   JWT_SECRET=your_jwt_secret  # Optional: for JWT based authentication
2. **Ensure MongoDB is running on your machine (or update the MONGO_URI accordingly).**
## Running the Project
**To run the project in development mode:**
  ```bash
  npm start
  ```
The server should start on the port defined in the .env file (default is 5000). You should see a message like:
  ```bash
  MongoDB connected
  Server started on port 5000
  ```
## API Endpoints
**Authentication**
1. Register User
   ```bash
   POST /api/auth/register
    ```
2. Request Body:
   ```bash
    {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "password123",
    "pastNeetScore": 750
    }
    ```
**Quiz Endpoints**
1. Fetch Quiz
   ```bash
    GET /api/quiz/:quizId
    ```
   Replace :quizId with the quiz identifier (e.g., 1).
3. Submit Quiz Responses
   ```bash
    POST /api/quiz/:quizId/submit
    ```
   Request body:
   ```bash
    {
      "userId": "<USER_ID>",
      "responses": {
        "1": "A programming language",
        "2": "A function with access to its outer scope"
      }
    }
    ```
**Analysis Endpoint**
1. Analyze User Performance
   ```bash
    GET /api/analysis/:userId
    ```
   Replace :userId with the user’s identifier.

## Populating Sample Data
Before testing the quiz endpoints, add a sample quiz to the database. You can use MongoDB Compass, the Mongo shell, or a simple script. For example, using the Mongo shell:
1. Connect to your MongoDB instance
2. Switch to the quiz-app database and insert a quiz:
   ```bash
    use quiz-app
      db.quizzes.insertOne({
        id: '1',
        title: 'JavaScript Basics',
        description: 'Test your JavaScript fundamentals',
        questions: [
          {
            id: '1',
            questionText: 'What is JavaScript?',
            options: ['A programming language', 'A markup language', 'A styling language', 'A database'],
            correctAnswer: 'A programming language',
            topic: 'Fundamentals'
          },
          {
            id: '2',
            questionText: 'What is a closure?',
            options: [
              'A function with access to its outer scope',
              'A way to close the browser',
              'A data type',
              'A loop type'
            ],
            correctAnswer: 'A function with access to its outer scope',
            topic: 'Functions'
          }
        ]
      });

    ```

   
---

### How to Use

1. **Clone the repository and navigate to the project directory.**
2. **Install the dependencies using `npm install`.**
3. **Create a `.env` file and set up your environment variables.**
4. **Ensure MongoDB is running and insert sample quiz data.**
5. **Run the project using `npm start`.**
6. **Test the API endpoints using a tool like Postman or cURL.**

This `README.md` provides all the information needed to set up and run the project on your machine.