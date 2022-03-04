const axios = require('axios');
const pool = require('../db/index.js');

module.exports = {

  getQuestions: (req, res) => {
    // console.log('working');
    const queryStr = `SELECT id, product_id, question_body, question_date, asker_name, reported, question_helpfulness
      FROM questions WHERE product_id = 1 AND reported = 'f' LIMIT 5`;

    pool.query(queryStr, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  // addQuestion: function(req, res) => {
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
    const queryStr = `SELECT answer_id, body, answer_date AS date, answerer_name, helpfulness, (
      SELECT array_agg(photo_url)
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

  // addAnswer: function(req, res) => {
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

  // helpfulQuestion: function(req, res) => {
    // const queryStr = ``;
    // const queryArgs = [ ];

    // pool.query(queryStr, queryArgs, (err, results) => {
    //   if (err) {
    //     res.status(404).send(err);
    //   } else {
    //     res.status(200).send(results);
    //   }
    // });
  // },

  // reportQuestion: function(req, res) => {
    // const queryStr = ``;
    // const queryArgs = [ ];

    // pool.query(queryStr, queryArgs, (err, results) => {
    //   if (err) {
    //     res.status(404).send(err);
    //   } else {
    //     res.status(200).send(results);
    //   }
    // });
  // },

  // helpfulAnswer: function(req, res) => {
    // const queryStr = ``;
    // const queryArgs = [ ];

    // pool.query(queryStr, queryArgs, (err, results) => {
    //   if (err) {
    //     res.status(404).send(err);
    //   } else {
    //     res.status(200).send(results);
    //   }
    // });
  // },

  // reportAnswer: function(req, res) => {
    // const queryStr = ``;
    // const queryArgs = [ ];

    // pool.query(queryStr, queryArgs, (err, results) => {
    //   if (err) {
    //     res.status(404).send(err);
    //   } else {
    //     res.status(200).send(results);
    //   }
    // });
  // }
}