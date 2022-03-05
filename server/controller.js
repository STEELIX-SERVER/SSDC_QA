const axios = require('axios');
const pool = require('../db/index.js');

module.exports = {

  // `SELECT json_build_object(
  //   'product_id', product_id,
  //   'results', array_agg(json_build_object(
  //     'question_id', question_id,
  //     'question_body', question_body,
  //     'question_date', question_date,
  //     'asker_name', asker_name,
  //     'question_helpfulness', question_helpfulness,
  //     'reported', reported
  //   ))
  // ) FROM questions WHERE product_id = 1 AND reported = false GROUP BY product_id`;

  // (SELECT json_build_object(
  //   'id', answer_id,
  //   'body', body,
  //   'date', answer_date,
  //   'anSwerer_name', answerer_name,
  //   'hepfulness', helpfulness
  // )) AS 68 FROM answers USING (question_id) GROUP BY question_id

  getQuestions: (req, res) => {
    console.log('working');
    // need var for answers_phtotos.answer_id, product_id
    const queryStr =
      `SELECT product_id,
        (SELECT array_agg (json_build_object(
          'question_id', question_id,
          'question_body', question_body,
          'question_date', question_date,
          'asker_name', asker_name,
          'question_helpfulness', question_helpfulness,
          'reported', questions.reported,
          'answers', (SELECT json_build_object(
            'answer_id', (SELECT json_build_object(
              'id', answer_id,
              'body', body,
              'date', answer_date,
              'answerer_name', answerer_name,
              'helpfulness', helpfulness,
              'photos', (select array_agg(json_build_object(
                'id', id,
                'url', photo_url
              )) FROM answers_photos INNER JOIN answers
              USING (answer_id) where answers_photos.answer_id = 5)
            ))
          ))
        ))) AS results FROM questions
          LEFT JOIN answers USING (question_id)
        WHERE product_id = 1 AND questions.reported = false GROUP BY product_id`;

    // const queryStr = `SELECT question_id, product_id, question_body, question_date,
    //   asker_name, reported, question_helpfulness
    //   FROM questions WHERE product_id = 1 AND reported = 'f' LIMIT 5`;

    pool.query(queryStr, (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  // addQuestion: (req, res) => {
  //   console.log('question req.body ', req.body);
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