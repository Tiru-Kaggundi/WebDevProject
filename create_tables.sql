-- Can we create a sqlite3 database from here? how?
-- I use command line to create a database like this $> sqlite3 belayDB
-- https://stackoverflow.com/questions/32044733/storing-dictionary-of-dictionary-in-sqlite3
-- above link to convert replies into dict format rather than having a different table if it gets painful

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS replies;


create table chats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug VARCHAR(30) NOT NULL,
  title VARCHAR(255) NOT NULL
);

create table posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    body TEXT,
    author VARCHAR(40),
    chat_id INTEGER,
    FOREIGN KEY(chat_id) REFERENCES chats(id), 
    FOREIGN KEY(author) REFERENCES users(username)
);

create table replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id INTEGER,
  body TEXT,
  author VARCHAR(40),
  FOREIGN KEY(author) REFERENCES users(username),
  FOREIGN KEY(chat_id) REFERENCES chats(id)
);

create table users (
  username VARCHAR(40) PRIMARY KEY,
  password VARCHAR(60)
);

PRAGMA foreign_keys = ON;