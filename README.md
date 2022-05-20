# QUESTIONS AND ANSWERS
This is the endpoint for the Questions & Answers module.

## Setup
- Clone the package into your repository
- Install dependencies with `npm install`
- Load the database with `npm run build`
- Start the server with `npm start`
- Follow the instructions in config_example.js

## Endpoints
`GET /qa/questions` Retrieves a list of questions for a particular product. This list does not include any reported questions.

`GET /qa/questions/:question_id/answers` Returns answers for a given question. This list does not include any reported answers.

`POST /qa/questions` Adds a question for the given product

`POST /qa/questions/:question_id/answers` Adds an answer for the given question.

`PUT /qa/questions/:question_id/helpful` Updates a question to show it was found helpful.

`PUT /qa/questions/:question_id/report` Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.

`PUT /qa/answers/:answer_id/helpful` Updates an answer to show it was found helpful.

`PUT /qa/answers/:answer_id/report` Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.
