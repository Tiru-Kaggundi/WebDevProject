INSERT INTO channels (title)
VALUES('First Channel');

INSERT INTO channels (title)
VALUES('second Channel');

INSERT INTO channels (title)
VALUES('third Channel');

INSERT INTO users (username, password, auth_key)
VALUES('tiru1', 'pwd1', 'afdafasdfasdfas');
INSERT INTO users (username, password, auth_key)
VALUES('tiru2', 'pwd2', ';lj;kjl;kjl;');
INSERT INTO users (username, password, auth_key)
VALUES('tiru3', 'pwd3', 'fasdiekd');

INSERT INTO messages (body, author, channel_id)
VALUES('chat 1 - First post text here', 'tiru1', 1);

INSERT INTO messages (body, author, channel_id)
VALUES('chat 1 - Second post text here', 'tiru2', 1);

INSERT INTO messages (body, author, channel_id)
VALUES('chat 2 - First post text here', 'tiru1', 2);

INSERT INTO messages (body, author, channel_id)
VALUES('chat 2 - Second post text here', 'tiru2', 2);

INSERT INTO messages (body, author, channel_id)
VALUES('chat 2 - Third post text here', 'tiru3', 2);

INSERT INTO replies (message_id, body, author)
VALUES(1, 'First Reply text to chat 1 post 1', 'tiru3');

INSERT INTO replies (message_id, body, author)
VALUES(1, 'Second Reply text to chat 1 post 1', 'tiru1');
