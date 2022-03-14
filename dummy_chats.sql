INSERT INTO chats (slug, title)
VALUES('slug1', 'First Chat');

INSERT INTO chats (slug, title)
VALUES('slug2', 'second Chat');

INSERT INTO chats (slug, title)
VALUES('slug3', 'third Chat');

INSERT INTO users (username, password)
VALUES('tiru1', 'pwd1');
INSERT INTO users (username, password)
VALUES('tiru2', 'pwd2');
INSERT INTO users (username, password)
VALUES('tiru3', 'pwd3');

INSERT INTO posts (body, author, chat_id)
VALUES('chat 1 - First post text here', 'tiru1', 1);

INSERT INTO posts (body, author, chat_id)
VALUES('chat 1 - Second post text here', 'tiru2', 1);

INSERT INTO posts (body, author, chat_id)
VALUES('chat 2 - First post text here', 'tiru1', 2);

INSERT INTO posts (body, author, chat_id)
VALUES('chat 2 - Second post text here', 'tiru2', 2);

INSERT INTO posts (body, author, chat_id)
VALUES('chat 2 - Third post text here', 'tiru3', 2);

INSERT INTO replies (chat_id, body, author)
VALUES(1, 'First Reply text to chat 1 post 1', 'tiru3');

INSERT INTO replies (chat_id, body, author)
VALUES(1, 'Second Reply text to chat 1 post 1', 'tiru1');
