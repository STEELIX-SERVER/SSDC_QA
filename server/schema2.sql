-- DROP DATABASE IF EXISTS qa;
-- CREATE DATABASE qa;
-- \c qa;

-- -- Table 'products'

-- -- DROP TABLE IF EXISTS products;

-- -- CREATE TABLE products (
-- --   id integer GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
-- --   product_name VARCHAR (60) NOT NULL,
-- --   slogan VARCHAR () NOT NULL,
-- --   product_description VARCHAR (1000) NOT NULL,
-- --   category VARCHAR (60) NOT NULL,
-- --   default_price VARCHAR (60) NOT NULL,
-- -- );
-- -- COPY products(id, product_name, slogan, product_description, category, default_price)
-- -- FROM '/Users/rockw/hackreactor/SDC/csv/products.csv'
-- -- DELIMITER ','
-- -- CSV HEADER;

-- -- Table 'questions'

-- -- DROP TABLE IF EXISTS questions;

-- CREATE TABLE questions (
--   question_id integer GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
--   product_id INTEGER NOT NULL,
--   question_body VARCHAR (1000) NOT NULL,
--   question_date VARCHAR NOT NULL,
--   asker_name VARCHAR(60) NOT NULL,
--   asker_email VARCHAR(60) NOT NULL,
--   reported BOOLEAN,
--   question_helpfulness INT NOT NULL
-- );

-- COPY questions (question_id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
-- FROM '/Users/rockw/hackreactor/SDC/csv/questions.csv'
-- DELIMITER ','
-- CSV HEADER;

-- -- DROP TABLE IF EXISTS answers;

-- CREATE TABLE answers (
--   answer_id integer GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
--   question_id INTEGER NOT NULL,
--   body VARCHAR (1000) NOT NULL,
--   answer_date VARCHAR NOT NULL,
--   answerer_name VARCHAR (60) NOT NULL,
--   answerer_email VARCHAR (60) NOT NULL,
--   reported BOOLEAN,
--   helpfulness INTEGER NOT NULL,
--   FOREIGN KEY (question_id)
--     REFERENCES questions (question_id)
--       ON DELETE CASCADE
-- );



-- COPY answers(answer_id, question_id, body, answer_date, answerer_name, answerer_email, reported, helpfulness)
-- FROM '/Users/rockw/hackreactor/SDC/csv/answers.csv'
-- DELIMITER ','
-- CSV HEADER;


-- c

-- CREATE TABLE answers_photos (
--   id integer GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
--   answer_id INTEGER NOT NULL,
--   photo_url VARCHAR NOT NULL,
--   FOREIGN KEY (answer_id)
--       REFERENCES answers (answer_id)
--         ON DELETE CASCADE
-- );


-- COPY answers_photos (id, answer_id, photo_url)
-- FROM '/Users/rockw/hackreactor/SDC/csv/answers_photos.csv'
-- DELIMITER ','
-- CSV HEADER;


