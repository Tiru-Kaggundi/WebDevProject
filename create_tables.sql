-- Can we create a sqlite3 database from here? how?
-- I use command line to create a database like this $> sqlite3 belayDB
-- https://stackoverflow.com/questions/32044733/storing-dictionary-of-dictionary-in-sqlite3
-- above link to convert replies into dict format rather than having a different table if it gets painful

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS channels;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS replies;


create table channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug VARCHAR(30) NOT NULL,
  title VARCHAR(255) NOT NULL
);

create table messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    body TEXT,
    author VARCHAR(40),
    message_id INTEGER,
    FOREIGN KEY(message_id) REFERENCES channels(id), 
    FOREIGN KEY(author) REFERENCES users(username)
);

create table replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id INTEGER,
  body TEXT,
  author VARCHAR(40),
  FOREIGN KEY(author) REFERENCES users(username),
  FOREIGN KEY(message_id) REFERENCES messages(id)
);

create table users (
  username VARCHAR(40) PRIMARY KEY,
  password VARCHAR(60),
  auth_key VARCHAR(40)
);

PRAGMA foreign_keys = ON;