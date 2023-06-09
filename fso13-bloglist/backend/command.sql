CREATE TABLE blogs (
  id serial PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes int DEFAULT 0
);

INSERT INTO blogs (id, author, url, title, likes) VALUES (1, 'Robert Martin', 'some link', 'Refactoring code', 8), (2, 'Niccolo Machiavelli', 'link', 'The Prince');