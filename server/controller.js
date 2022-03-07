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

      // `SELECT answer_id FROM answers INNER JOIN questions USING (question_id)`
    // need resolve answers_photos.answer_id, product_id
    // (SELECT CAST (answer_id AS INTEGER) FROM answers WHERE answers.question_id = questions.question_id)


    // 'answers', (SELECT json_build_object(
    //   '68', (SELECT json_build_object(
    //     'id', answer_id,
    //     'body', body,
    //     'date', answer_date,
    //     'answerer_name', answerer_name,
    //     'helpfulness', helpfulness
    //   ))
    // ))
    // 'photos', (select array_agg(json_build_object(
    //   'id', id,
    //   'url', photo_url
    // )) FROM answers_photos INNER JOIN answers
    // USING (answer_id) where answers_photos.answer_id = 5 GROUP BY answer_id)
//-------
    // const queryStr =
    //   `SELECT product_id,
    //     (SELECT array_agg (json_build_object(
    //       'question_id', question_id,
    //       'question_body', question_body,
    //       'question_date', question_date,
    //       'asker_name', asker_name,
    //       'question_helpfulness', question_helpfulness,
    //       'reported', questions.reported

    //     ))) AS results FROM questions

    //     WHERE product_id = $1 AND questions.reported = false
    //     GROUP BY product_id`;

        // GROUP BY questions.product_id
        // LEFT JOIN answers USING (question_id)
    // const queryStr = `SELECT question_id, product_id, question_body, question_date,
    //   asker_name, reported, question_helpfulness
    //   FROM questions WHERE product_id = 1 AND reported = 'f' LIMIT 5`;

  getQuestions: (req, res) => {
    // console.log('q getall query ', req.query);

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
     as results FROM questions WHERE product_id = $1 AND reported = false GROUP BY product_id`;


      // const queryStr =
      // `SELECT product_id, json_agg( json_build_object (
      //   'question_id', question_id,
      //   'question_body', question_body,
      //   'question_date', question_date,
      //   'asker_name', asker_name,
      //   'question_helfulness', question_helpfulness,
      //   'answers', (
      //     SELECT json_object_agg( answers.answer_id, json_build_object (
      //       'id', answer_id,
      //       'body', body
      //       'date', answer_date,
      //       'answerer_name', answerer_name,
      //       'helpfulness', helpfulness,
      //       'photos', (
      //         SELECT json_agg( json_build_object (
      //           'id', id,
      //           'url', photo_url
      //         )) FROM answers_photos ap WHERE ap.answer_id = a.answer_id
      //       )
      //     )) ORDER BY helpfulness DESC
      //   ) FROM answers a WHERE a.question_id = q.question_id
      // )) ORDER BY question_helpfulness DESC
      // AS results FROM questions q WHERE product_id = $1 AND reported = false GROUP BY product_id`;

    const queryArgs= [req.query.product_id];


    pool.query(queryStr, queryArgs, (err, results) => {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        console.log(results);

        // const results = {
        //   product_id: req.query.product_id,
        //   results:
        // }
        // you can redefine something to send
        res.status(200).send(results.rows[0]);
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
    const body = req.body.body || '';
    const name = req.body.name || '';
    const email = req.body.email || '';
    // photos?
    const queryStr = `INSERT INTO answers (question_id, body, answer_date, answerer_name, answerer_email, reported, helpfulness)
      VALUES ($1, ${body}, ${date}, ${name}, ${email}, 'f', 0)`;

      // const queryStr = `INSERT INTO answers (question_id, body, answer_date, answerer_name, answerer_email, reported, helpfulness)
      // VALUES (1, 'test', 'test', 'test', 'test.com', 'f', 0)`;

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