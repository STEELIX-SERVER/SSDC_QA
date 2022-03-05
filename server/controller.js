const axios = require('axios');
const pool = require('../db/index.js');

module.exports = {

  getQuestions: (req, res) => {
    // console.log('working');
    // `SELECT product_id, (
    //   SELECT array_agg(question_id, question_body, question_date, asker_name,
    //     question_helpfulness, reported) as results)
    //   FROM questions WHERE product_id = 1 AND reported = 'f' LIMIT 5
    // FROM questions WHERE product_id = 1 AND reported = 'f' LIMIT 5`;

    const queryStr = `SELECT question_id, product_id, question_body, question_date,
      asker_name, reported, question_helpfulness
      FROM questions WHERE product_id = 1 AND reported = 'f' LIMIT 5`;

    pool.query(queryStr, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  // addQuestion: (req, res) => {
  //   const queryStr = `INSERT INTO questions(product_id, question_body, question_date, asker_name, reported, question_helpfulness)
  //     VALUES ()`;
  //   const queryArgs = [req.product_id, req.body, req.name, req.email, ];

  //   pool.query(queryStr, queryArgs, (err, results) => {
  //     if (err) {
  //       res.status(404).send(err);
  //     } else {
  //       res.status(200).send(results);
  //     }
  //   });
  // },

  getAnswers: (req, res) => {
    // coalesce
    // SELECT array_agg(json_build_object('id', id, 'url', photo_url) as photos
    const queryStr = `SELECT answer_id, body, answer_date AS date, answerer_name, helpfulness, (
      SELECT array_agg(json_build_object('id', id, 'url', photo_url)) as photos
        FROM answers_photos INNER JOIN answers
        USING (answer_id) where answers_photos.answer_id = 5)
      FROM answers WHERE answers.answer_id = 5 AND reported = 'f' LIMIT 5`;

    pool.query(queryStr, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  // addAnswer: (req, res) => {
  //   const queryStr = `INSERT INTO answers(body, answer_date AS date, answerer_name, helpfulness, photos)
  //     VALUES ()`;
  //   const queryArgs = [ ];

  //   pool.query(queryStr, queryArgs, (err, results) => {
  //     if (err) {
  //       res.status(404).send(err);
  //     } else {
  //       res.status(200).send(results);
  //     }
  //   });
  // },

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