# Quiz System API Documentation

![Database ERD](https://github.com/f4rxs/Quiz-project/assets/118629992/3f67b226-aaf6-4fc7-90fa-6163fae23648)

## Overview

Welcome to the Quiz System API! This API provides endpoints to manage users, quizzes, questions, choices, results, and more for an interactive quiz platform.

## Getting Started

To start using the Quiz System API, follow these steps:

1. Run `npm install` to install dependencies.
2. Configure your environment variables, including the database connection details.
3. Run the server with `npm start`.

## Student Routes

### Update a Student by ID

- **Route:** /quizsystem/student/:id
- **Method:** PUT
- **Description:** Update a student account.
- **Request Body:**
  - Username (string): Student's username.
  - Email (string): Student's email address.
  - Password (string): Student's password.
- **Response:**
  - 200 (OK): User updated successfully.
  - 400 (Bad Request): If any of the fields are missing.
  - 500 (Internal Server Error)

### Update a Student's Password

- **Route:** /quizsystem/student-pass/:id
- **Method:** PUT
- **Description:** Update a student's password.
- **Request Body:**
  - Password (string): Student's password.
- **Response:**
  - 200 (OK): Password updated successfully.
  - 404 (Not Found): If the student’s ID is not found.
  - 500 (Internal Server Error)

### Delete a Student

- **Route:** /quizsystem/student/:id
- **Method:** DELETE
- **Description:** Delete a student.
- **Response:**
  - 200 (OK): Student deleted successfully.
  - 404 (Not Found): If the student’s ID is not found.
  - 500 (Internal Server Error)

### Get Student by ID

- **Route:** /quizsystem/student/:id
- **Method:** GET
- **Description:** Get a student by ID.
- **Response:**
  - 200 (OK): Student retrieved successfully.
  - 404 (Not Found): If the student’s ID is not found.
  - 500 (Internal Server Error)

### Get All Students

- **Route:** /quizsystem/student
- **Method:** GET
- **Description:** Get all students.
- **Response:**
  - 200 (OK): Students retrieved successfully.
  - 404 (Not Found): No students found.
  - 500 (Internal Server Error)

## Instructor Routes

### Delete Instructor by ID

- **Route:** /instruct/:id
- **Method:** DELETE
- **Description:** Delete an instructor.
- **Response:**
  - 200 (Update): Instructor deleted successfully.
  - 404 (Not Found): If the instructor's id is not found.
  - 500 (Internal Server Error): If there was an issue deleting the instructor.

### Update Instructor by ID

- **Route:** /instruct/:id
- **Method:** PUT
- **Description:** Update instructor details.
- **Response:**
  - 200 (Update): Instructor updated successfully.
  - 404 (Not Found): If the instructor's id is not found.
  - 500 (Internal Server Error): If there was an issue updating the instructor.

### Update Instructor's Password

- **Route:** /instruct-pass/:id
- **Method:** PUT
- **Description:** Update instructor's password.
- **Response:**
  - 200 (Update): Instructor password updated successfully.
  - 404 (Not Found): If the instructor's id is not found.
  - 500 (Internal Server Error): If there was an issue updating the password.

### Register Instructor

- **Route:** /instruct
- **Method:** POST
- **Description:** Register a new instructor.
- **Response:**
  - 201 (Created): Instructor registered successfully.
  - 400 (Bad Request): If the request body is invalid.
  - 500 (Internal Server Error): If there was an issue creating the instructor.

### Get All Instructors Usernames

- **Route:** /instructors
- **Method:** GET
- **Description:** Get usernames of all instructors.
- **Response:**
  - 200 (OK): Returns a JSON array of instructor usernames.
  - 404 (Not Found): If no instructors are found.
  - 500 (Internal Server Error): If there was an issue fetching instructors.

### Get Instructor by ID

- **Route:** /instruct/:id
- **Method:** GET
- **Description:** Get instructor details by ID.
- **Response:**
  - 200 (OK): Returns detailed information about the instructor.
  - 404 (Not Found): If the instructor's id is not found.
  - 500 (Internal Server Error): If there was an issue fetching the instructor.

## Choice Routes

### Create Choice

- **Route:** /choices
- **Method:** POST
- **Description:** Create a new choice.
- **Response:**
  - 201 (Created): Choice created successfully.
  - 400 (Bad Request): If the request body is invalid.
  - 500 (Internal Server Error): If there was an issue creating the choice.

### Update Choice

- **Route:** /choices/:choiceID
- **Method:** PUT
- **Description:** Update choice details.
- **Response:**
  - 200 (Update): Choice updated successfully.
  - 404 (Not Found): If the choice's id is not found.
  - 500 (Internal Server Error): If there was an issue updating the choice.

### Delete Choice

- **Route:** /choices/:choiceID
- **Method:** DELETE
- **Description:** Delete a choice.
- **Response:**
  - 200 (Update): Choice deleted successfully.
  - 404 (Not Found): If the choice's id is not found.
  - 500 (Internal Server Error): If there was an issue deleting the choice.

## Question Routes

### Get Question by ID

- **Route:** /question/:questionId
- **Method:** GET
- **Description:** Get question details by ID.
- **Response:**
  - 200 (OK): Returns detailed information about the question.
  - 404 (Not Found): If the question's id is not found.
  - 500 (Internal Server Error): If there was an issue fetching the question.

### Update Question

- **Route:** /question/:questionId
- **Method:** PUT
- **Description:** Update question details.
- **Response:**
  - 200 (Update): Question updated successfully.
  - 404 (Not Found): If the question's id is not found.
  - 500 (Internal Server Error): If there was an issue updating the question.

### Delete Question

- **Route:** /question/:questionId
- **Method:** DELETE
- **Description:** Delete a question.
- **Response:**
  - 200 (Update): Question deleted successfully.
  - 404 (Not Found): If the question's id is not found.
  - 500 (Internal Server Error): If there was an issue deleting the question.

### Create Question

- **Route:** /question
- **Method:** POST
- **Description:** Create a new question.
- **Response:**
  - 201 (Created): Question created successfully.
  - 400 (Bad Request): If the request body is invalid.
  - 500 (Internal Server Error): If there was an issue creating the question.

## Quiz Routes

### Get Quiz by ID

- **Route:** /quiz/:QuizID
- **Method:** GET
- **Description:** Get quiz details by ID.
- **Response:**
  - 200 (OK): Returns detailed information about the quiz.
  - 404 (Not Found): If the quiz's id is not found.
  - 500 (Internal Server Error): If there was an issue fetching the quiz.

### Get All Quizzes

- **Route:** /quiz
- **Method:** GET
- **Description:** Get a list of all quizzes.
- **Response:**
  - 200 (OK): Returns a JSON array of quizzes.
  - 404 (Not Found): If no quizzes are found.
  - 500 (Internal Server Error): If there was an issue fetching quizzes.

### Get Quizzes by Instructor ID

- **Route:** /quiz/instructor/:instructorID
- **Method:** GET
- **Description:** Get quizzes by instructor ID.
- **Response:**
  - 200 (OK): Returns a JSON array of quizzes.
  - 404 (Not Found): If no quizzes are found for the given instructor.
  - 500 (Internal Server Error): If there was an issue fetching quizzes.

### Get Questions for Quiz

- **Route:** /quiz/questions/:QuizID
- **Method:** GET
- **Description:** Get questions for a specific quiz.
- **Response:**
  - 200 (OK): Returns a JSON array of questions for the specified quiz.
  - 404 (Not Found): If no questions are found for the given quiz.
  - 500 (Internal Server Error): If there was an issue fetching questions.

### Create Quiz

- **Route:** /quiz
- **Method:** POST
- **Description:** Create a new quiz.
- **Response:**
  - 201 (Created): Quiz created successfully.
  - 400 (Bad Request): If the request body is invalid.
  - 500 (Internal Server Error): If there was an issue creating the quiz.

### Update Quiz

- **Route:** /quiz/:QuizID
- **Method:** PUT
- **Description:** Update quiz details.
- **Response:**
  - 200 (Update): Quiz updated successfully.
  - 404 (Not Found): If the quiz's id is not found.
  - 500 (Internal Server Error): If there was an issue updating the quiz.

### Delete Quiz

- **Route:** /quiz/:QuizID
- **Method:** DELETE
- **Description:** Delete a quiz.
- **Response:**
  - 200 (Update): Quiz deleted successfully.
  - 404 (Not Found): If the quiz's id is not found.
  - 500 (Internal Server Error): If there was an issue deleting the quiz.

## Result Routes

### Get Results for Student

- **Route:** /result-student/:StudentID
- **Method:** GET
- **Description:** Get results for a specific student.
- **Response:**
  - 200 (OK): Returns a JSON array of results for the specified student.
  - 404 (Not Found): If no results are found for the given student.
  - 500 (Internal Server Error): If there was an issue fetching results.

### Get Results for Quiz

- **Route:** /result-quiz/:quizID
- **Method:** GET
- **Description:** Get results for a specific quiz.
- **Response:**
  - 200 (OK): Returns a JSON array of results for the specified quiz.
  - 404 (Not Found): If no results are found for the given quiz.
  - 500 (Internal Server Error): If there was an issue fetching results.

### Calculate Overall Score for Quiz

- **Route:** /result/:quizID/overall-score
- **Method:** GET
- **Description:** Calculate overall score for a quiz.
- **Response:**
  - 200 (OK): Returns the overall score for the specified quiz.
  - 404 (Not Found): If no results are found for the given quiz.
  - 500 (Internal Server Error): If there was an issue calculating the overall score.

### Create Result

- **Route:** /result
- **Method:** POST
- **Description:** Create a new result.
- **Response:**
  - 201 (Created): Result created successfully.
  - 400 (Bad Request): If the request body is invalid.
  - 500 (Internal Server Error): If there was an issue creating the result.

### Update Result

- **Route:** /result/:ResultID
- **Method:** PUT
- **Description:** Update result details.
- **Response:**
  - 200 (Update): Result updated successfully.
  - 404 (Not Found): If the result's id is not found.
  - 500 (Internal Server Error): If there was an issue updating the result.

### Delete Result

- **Route:** /result/:ResultID
- **Method:** DELETE
- **Description:** Delete a result.
- **Response:**
  - 200 (Update): Result deleted successfully.
  - 404 (Not Found): If the result's id is not found.
  - 500 (Internal Server Error): If there was an issue deleting the result.
