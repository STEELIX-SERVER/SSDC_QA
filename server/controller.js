const axios = require('axios');
const pool = require('../db/index.js');

module.exports = {

  getQuestions: (req, res) => {
    // console.log('q getall query ', req.query);

    const page = req.params.page || 1;
    const count = req.params.count || 5;

    let queryStr =
      `SELECT product_id, json_agg(json_build_object(
        'question_id', question_id,
        'question_body', question_body,
        'question_date', question_date,
        'asker_name', asker_name,
        'question_helpfulness', question_helpfulness,
        'reported', reported,
        'answers', (
          SELECT coalesce(json_object_agg (
            answers.answer_id, json_build_object (
              'id', answer_id,
              'body', body,
              'date', answer_date,
              'answerer_name', answerer_name,
              'helpfulness', helpfulness,
              'photos', (
                SELECT coalesce(json_agg (json_build_object (
                  'id', answer_id,
                  'url', photo_url
                )), '[]')
              FROM answers_photos WHERE answers.answer_id = answers_photos.answer_id
            )
          ) ORDER BY helpfulness DESC ), '{}')
        FROM answers WHERE questions.question_id = answers.question_id
        )
      ) ORDER BY question_helpfulness DESC)
     as results FROM questions WHERE product_id = $1 AND reported = false GROUP BY product_id
     LIMIT ${count} OFFSET ${count * page - count}`;

    const queryArgs= [req.query.product_id];


    pool.query(queryStr, queryArgs, (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        console.log(results);
        res.status(200).send(results.rows[0]);
      }
    });
  },

  // addQuestion: (req, res) => {
  //   console.log('question req.body ', req.body);
  //   const date = new Date();
  //   const body = req.body.body;
  //   const name = req.body.name;
  //   const email = req.body.email;

  //   const queryStr = `INSERT INTO questions(product_id, question_body, question_date, asker_name, asnwer_email, reported, question_helpfulness)
  //     VALUES ($1, ${body}, ${date}, ${name}, ${email}, 'f', 0)`;
  //   const queryArgs = [req.query.product_id];

  //   pool.query(queryStr, queryArgs, (err, results) => {
  //     if (err) {
  //       res.status(404).send(err);
  //     } else {
  //       res.status(200).send(results);
  //     }
  //   });
  // },

  getAnswers: (req, res) => {
    //do the order by helpfulness

    console.log('r getall query ', req.params);
    const question_id = req.params.question_id;
    const page = req.params.page || 1;
    const count = req.params.count || 5;

    const queryStr =
      `SELECT array_agg(json_build_object(
        'answer_id', answer_id,
        'body', body,
        'date', answer_date,
        'answerer_name', answerer_name,
        'helpfulness', helpfulness,
        'photos', (
          SELECT coalesce(array_agg(json_build_object(
            'id', id,
            'url', photo_url
          )), '{}') FROM answers_photos ap WHERE a.answer_id = ap.answer_id)
      ) ORDER BY helpfulness DESC) AS results FROM answers a WHERE question_id = $1 AND reported = false
      LIMIT ${count} OFFSET ${count * page - count}`;

      const queryArgs = [req.params.question_id];

    pool.query(queryStr, queryArgs, (err, results) => {
      if (err) {
        console.log(err)
        res.status(404).send(err);
      } else {
        let response = {
          question: req.params.question_id,
          page: req.params.page || 1,
          count: req.params.count || 5,
          results: results.rows[0].results
        }
        res.status(200).send(response);
      }
    });
  },

  addAnswer: (req, res) => {
    console.log('add answer req.body ', req.body);
    const date = new Date();
    // const body = req.body.body;
    // const name = req.body.name;
    // const email = req.body.email;
    // photos?
    const queryStr = `INSERT INTO answers (question_id, body, answer_date, answerer_name, answerer_email, reported, helpfulness)
      VALUES ($1, $2, ${date}, $3, $4, 'f', 0)
      RETURNING answer_id`;

      // const queryStr = `INSERT INTO answers (question_id, body, answer_date, answerer_name, answerer_email, reported, helpfulness)
      // VALUES (1, 'test', 'test', 'test', 'test.com', 'f', 0)`;

    const queryArgs = [req.params.question_id, req.body.body, req.body.name, req.body.email];

    pool.query(queryStr, queryArgs, (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  helpfulQuestion: (req, res) => {
    // console.log('hq params ', req.params);
    const queryStr = `UPDATE questions
        SET question_helpfulness = question_helpfulness + 1
        WHERE question_id = $1`;
    const queryArgs = [req.params.question_id];

    pool.query(queryStr, queryArgs, (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  reportQuestion: (req, res) => {
    const queryStr = `UPDATE questions
      SET reported = true
      WHERE question_id = $1`;
    const queryArgs = [req.params.question_id];

    pool.query(queryStr, queryArgs, (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  helpfulAnswer: (req, res) => {
    console.log('ha params ', req.params);
    const queryStr = `UPDATE answers
      SET helpfulness = helpfulness + 1
      WHERE answer_id = $1`;
    const queryArgs = [req.params.answer_id];

    pool.query(queryStr, queryArgs, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  reportAnswer: (req, res) => {
    const queryStr = `UPDATE answers
      SET reported = true
      WHERE answer_id = $1`;
    const queryArgs = [req.params.answer_id];

    pool.query(queryStr, queryArgs, (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  }
}