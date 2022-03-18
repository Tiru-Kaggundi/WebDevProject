import string
import random
import logging
# import time
# from datetime import datetime, timedelta
from flask import Flask, render_template, request, make_response, url_for, redirect, jsonify
# from functools import wraps
import sqlite3
import bcrypt
import configparser

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
DB_NAME = 'belayDB'
# Think if you want to simplify the configparser - or remove it altogether
config = configparser.ConfigParser()
config.read('secrets.cfg')
DB_USERNAME = config['secrets']['DB_USERNAME']
DB_PASSWORD = config['secrets']['DB_PASSWORD']
PEPPER = config['secrets']['PEPPER']

connection = sqlite3.connect(DB_NAME)
cursor = connection.cursor()

chats = {}
auth_tokens = {}
users = {}


def generate_token():
    return ''.join(random.choices(string.ascii_lowercase + string.digits,
                                  k=10))

# Bcrypt based user singup or login start

@app.route('/api/signup', methods=['POST'])
def signup():
    print("came into signup")
    print(request.data)
    body = request.get_json()
    print(body)
    print("printed body")

    username = body['username']
    password = (body['password'] + PEPPER).encode('utf-8')
    auth_key = generate_token()
    print(password)

    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()

    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    print(hashed)

    query = "INSERT into users (username, password, auth_key) VALUES (?, ?, ?)"

    try:
        print("came into try")
        cursor.execute(query, (username, hashed, auth_key))
        connection.commit()
        print("about to return try")
        return {}
    except Exception as e:
        print("entered exception")
        print(e)
        return {"username": username}, 302
    finally:
        cursor.close()
        connection.close()


@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json()
    username = body['username']
    password = (body['password'] + PEPPER).encode('utf-8')
    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()
    query = "SELECT password, auth_key FROM users WHERE username=?"
    try:
        cursor.execute(query, (username, ))
        rv = cursor.fetchone()
        hashed = rv[0]
        auth_key = rv[1]
        if bcrypt.checkpw(password, hashed):
            # Think about it later! Should i send a hashed thing or should i make another auth_key
            return jsonify({'tiru_auth_key':auth_key})
        return {}, 404
    except Exception as e:
        print(e)
        return {}, 404
    finally:
        cursor.close()
        connection.close()
# Bcrypt based login singup ends

# Get channels list
@app.route('/api/getChannels', methods=['GET'])
def getChannels():
    app.logger.info("got into get Channels")
    tiru_auth_key = request.headers.get('tiru_auth_key')
    username = get_author_from_auth_key(tiru_auth_key) 
    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()
    query = "SELECT id, title FROM Channels ORDER BY id"
    if checkAuthkey(tiru_auth_key): 
        try:
            rv3 = []
            cursor.execute(query)
            rv1 = [item for item in cursor.fetchall()]
            app.logger.info(rv1)
            # get unread list
            rv2 = get_unread_info(username)
            app.logger.info(rv2)
            for i in range(len(rv1)):
                channel_id = rv1[i][0]
                channel_title = rv1[i][1]
                unread_messages = rv2[channel_id]
                rv3.append((channel_id, channel_title, unread_messages))
            return jsonify({'channels':rv3})
        except Exception as e:
            print(e)
            return {}, 404
        finally:
            cursor.close()
            connection.close()



# Create a new Channel from given channelName
@app.route('/api/createChannel', methods=['POST'])
def createChannel():
    app.logger.info("came to create a newChannel")
    tiru_auth_key = request.headers.get('tiru_auth_key')
    title = request.headers.get('channelName')
    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()
    query = "INSERT into channels (title) VALUES (?)"
    try:
        print("came into try: new channel")
        cursor.execute(query, (title,))
        connection.commit()
        rv = get_channelID_channelName(title)
        return {'currentChannelID': rv}
    except Exception as e:
        print("entered exception")
        print(e)
        return {'currentChannelID': ''}, 302
    finally:
        cursor.close()
        connection.close()




# Get chats or messages from the given channel number which has been clicked

@app.route('/api/channel/<int:channelID>', methods=['GET', 'POST'])
def getMessages(channelID):
    if request.method == 'GET': 
        app.logger.info("got in to get messages")
        tiru_auth_key = request.headers.get('tiru_auth_key')
        username = get_author_from_auth_key(tiru_auth_key)
        channel_id = int(channelID)
        connection = sqlite3.connect(DB_NAME)
        cursor = connection.cursor()
        query = "SELECT id, author, body FROM messages WHERE channel_id=?"
        if checkAuthkey(tiru_auth_key): 
            try:
                cursor.execute(query, (channel_id, ))
                rv = [item for item in cursor.fetchall()]
                # get number of replies
                new_rv = list(map(lambda x: list(x) + [get_number_replies(x[0])], rv))
                # app.logger.info(rv)
                # app.logger.info(new_rv)
                # insert last read message_id for this channel into last_read db table
                add_last_read(username, channel_id)
                # now return posts for rendering
                return jsonify({'posts':new_rv})
            except Exception as e:
                print(e)
                return {}, 404
            finally:
                cursor.close()
                connection.close()

    if request.method == 'POST':
        app.logger.info("got into to post the message")
        tiru_auth_key = request.headers.get('tiru_auth_key')
        author = get_author_from_auth_key(tiru_auth_key)
        channel_id = int(channelID)
        jsonRec = request.get_json()
        body = jsonRec['body']
        app.logger.info("Body received: ", body)
        connection = sqlite3.connect(DB_NAME)
        cursor = connection.cursor()
        query = "INSERT INTO messages (body, author, channel_id) VALUES(?, ?, ?)"
        if checkAuthkey(tiru_auth_key):
            try:
                cursor.execute(query, (body, author, channel_id, ))
                connection.commit()
                print("about to return try")
                return {}
            except Exception as e:
                print("entered exception")
                print(e)
                return {"Exection encountered": e}, 302
            finally:
                cursor.close()
                connection.close()


# Get and post replies 

@app.route('/api/channel/<int:channelID>/<int:messageID>', methods=['GET', 'POST'])
def getReplies(channelID, messageID):
    if request.method == 'GET': 
        #app.logger.info("got in to get replies for messageID", messageID)
        tiru_auth_key = request.headers.get('tiru_auth_key')
        message_id = int(messageID)
        connection = sqlite3.connect(DB_NAME)
        cursor = connection.cursor()
        query = "SELECT id, author, body FROM replies WHERE message_id=? ORDER BY id"
        if checkAuthkey(tiru_auth_key): 
            try:
                cursor.execute(query, (message_id, ))
                rv = [item for item in cursor.fetchall()]
                app.logger.info(rv)
                return jsonify({'replies':rv})
            except Exception as e:
                print(e)
                return {}, 404
            finally:
                cursor.close()
                connection.close()

    if request.method == 'POST':
        app.logger.info("got in to post reply")
        tiru_auth_key = request.headers.get('tiru_auth_key')
        author = get_author_from_auth_key(tiru_auth_key)
        message_id = int(messageID)
        jsonRec = request.get_json()
        app.logger.info("Json rec: ", jsonRec)
        body = jsonRec['body']
        #app.logger.info("Body received: ", body)
        connection = sqlite3.connect(DB_NAME)
        cursor = connection.cursor()
        query = "INSERT INTO replies (body, author, message_id) VALUES(?, ?, ?)"
        if checkAuthkey(tiru_auth_key):
            try:
                cursor.execute(query, (body, author, message_id, ))
                connection.commit()
                print("about to return try")
                return jsonify({'author':author})
            except Exception as e:
                print("entered exception")
                print(e)
                return {"Exection encountered": e}, 302
            finally:
                cursor.close()
                connection.close()


def checkAuthkey(auth_key):
    '''
    checks if the auth key exists for some user in database
    '''
    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()
    query = "SELECT username FROM users WHERE auth_key=?"
    try:
        cursor.execute(query, (auth_key, ))
        rv = cursor.fetchone()
        rv = len(rv)
    except Exception as e:
        print(e)
        return {}, 404
    finally:
        cursor.close()
        connection.close()
    return rv

def get_author_from_auth_key(auth_key):
    '''
    Get the name of the user from the auth_key
    '''
    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()
    query = "SELECT username FROM users WHERE auth_key=?"
    try:
        cursor.execute(query, (auth_key, ))
        rv = cursor.fetchone()
        author = rv[0]
    except Exception as e:
        print(e)
        return {}, 404
    finally:
        cursor.close()
        connection.close()
    return author

def get_channelID_channelName(title):
    '''
    Get the ID of the channel from the channelName
    '''
    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()
    query = "SELECT id FROM channels WHERE title=?"
    try:
        cursor.execute(query, (title, ))
        rv = cursor.fetchone()
        channelID = rv[0]
    except Exception as e:
        print(e)
        return {}, 404
    finally:
        cursor.close()
        connection.close()
    return channelID

def get_number_replies(message_id):
    '''
    given a message_id, gets the number of replies to that message id
    '''
    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()
    query = "SELECT COUNT(*) from replies WHERE message_id=?"
    try:
        cursor.execute(query, (message_id, ))
        n_replies = cursor.fetchone()[0]
        #app.logger.info("n_replies", n_replies)
    except Exception as e:
        print(e)
        return {}, 404
    finally:
        cursor.close()
        connection.close()
    return n_replies

def add_last_read(username, channel_id):
    '''
    add last_read_message_id for given username and channel id into last_read table
    '''
    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()
    query1 = "SELECT id FROM messages WHERE channel_id=? ORDER BY id DESC"
    query2 = "INSERT INTO last_read (username, channel_id, last_read_message_id) VALUES (?,?,?)"
    try:
        cursor.execute(query1, (channel_id, ))
        rv = cursor.fetchone()
        if rv:
            last_read_message_id = rv[0]
            cursor.execute(query2, (username, channel_id, last_read_message_id,))
            connection.commit()
    except Exception as e:
        print(e)
        return {}, 404
    finally:
        cursor.close()
        connection.close()
        if rv:
            return last_read_message_id
        return False


def get_unread_info(username):
    '''
    gets unread items count for each channel_id for given username
    '''
    app.logger.info("got into get_unread_function")
    last_read_pairs = {}
    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()
    query1 = "SELECT COUNT(*) FROM channels"
    query2 = "SELECT COALESCE(last_read_message_id, 0) FROM last_read WHERE channel_id = ? AND username = ? "
    query3 = "SELECT COUNT(*) FROM messages WHERE channel_id = ? AND id > ?"
    try:
        cursor.execute(query1)
        n_channels = cursor.fetchone()[0]
        app.logger.info("n_channels are:")
        app.logger.info(n_channels)
        for i in range(n_channels):
            app.logger.info("got into loop")
            app.logger.info(i)
            channel_id = i+1
            cursor.execute(query2, (channel_id, username,))
            returned = cursor.fetchone()
            if returned:
                last_read_message_id = returned[0]
                cursor.execute(query3, (channel_id, last_read_message_id, ))
                n_unread = cursor.fetchone()[0]
                app.logger.info("n_unread :")
                app.logger.info(n_unread)
            else:
                query = 'SELECT COUNT(*) from messages WHERE channel_id=?'
                cursor.execute(query, (channel_id,))
                n_unread = cursor.fetchone()[0]
            last_read_pairs[channel_id] = n_unread
    except Exception as e:
        print(e)
        return {}, 404
    finally:
        cursor.close()
        connection.close()
        app.logger.info(last_read_pairs)
        app.logger.info("returning now")
        return last_read_pairs






# TODO: Include any other routes your app might send users to
@app.route('/')
def index(chat_id=None, path=None):
    return app.send_static_file('index.html')
