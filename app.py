# app for starter - main app file
import string
# import random
# import logging
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
    print(password)

    connection = sqlite3.connect(DB_NAME)
    cursor = connection.cursor()

    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    print(hashed)

    query = "INSERT into users (username, password) VALUES (?, ?)"

    try:
        print("came into try")
        cursor.execute(query, (username, hashed))
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
    query = "SELECT password FROM users WHERE username=?"
    try:
        cursor.execute(query, (username, ))
        hashed = cursor.fetchone()[0]
        if bcrypt.checkpw(password, hashed):
            # Think about it later! Should i send a hashed thing or should i make another auth_key
            return jsonify({'session_token':str(hashed)})
        return {}, 404
    except Exception as e:
        print(e)
        return {}, 404
    finally:
        cursor.close()
        connection.close()

# Bcrypt based login singup ends




def newChat(username):
    authorized_users = [username]
    magic_key = ''.join(
        random.choices(string.ascii_lowercase + string.digits, k=40))
    return dict([("authorized_users", authorized_users),
                 ("magic_key", magic_key), ("messages", [])])


def appendUser(chat_id, username):
    if chat_id not in chats.keys():
        chat = newChat(username)
        chats[chat_id] = chat
    else:
        if (username not in chats[chat_id]['authorized_users']):
            chats[chat_id]['authorized_users'].append(username)
    return None


# TODO: Include any other routes your app might send users to
@app.route('/')
@app.route('/chat/<int:chat_id>')
@app.route("/<string:path>")
@app.route("/<path:path>")
def index(chat_id=None, path=None):
    return app.send_static_file('index.html')


# @app.route('/api/login', methods=["POST"])
# def login():
#     '''
#     Structure of users dict is {auth_key: (username, password)}
#     '''
#     jsonRec = request.get_json()
#     username = jsonRec['username']
#     password = jsonRec['password']



#     if username in [value[0] for key, value in users.items()]:
#         auth_key = [
#             key for key, value in users.items() if (value[0] == username)
#         ][0]
#         app.logger.info("user already present")
#         app.logger.info(auth_key)
#         app.logger.info(users[auth_key])
#         if (password == users[auth_key][1]):
#             app.logger.info("password matches")
#             rv = {
#                 'message': "Logged in:",
#                 'username': username,
#                 'auth_key': auth_key,
#                 'status': 'match'
#             }
#             return make_response(jsonify(rv), 200)
#         else:
#             app.logger.info("password doesn't match")
#             rv = {
#                 'message': "Password doesn't match for user: ",
#                 'username': username,
#                 'auth_key': '',
#                 'status': 'error'
#             }
#             return make_response(jsonify(rv), 200)
#     else:
#         app.logger.info("user is not in system")
#         app.logger.info("inserting user")
#         auth_key = generate_token()
#         users[auth_key] = (username, password)
#         app.logger.info("registered users are:")
#         app.logger.info(users)
#         rv = {
#             'message': "User Added with username: ",
#             'username': username,
#             'auth_key': auth_key,
#             'status': 'new'
#         }
#         return make_response(jsonify(rv), 200)


# @app.route('/appendUserToChat', methods=['POST'])
# def appendUserToChat():
#     app.logger.info("adding user to chat")
#     app.logger.info(f"existing chats: {chats}")
#     auth_key = request.headers['auth_key']
#     username = users[auth_key][0]
#     app.logger.info(f"username {username}")
#     magic_key = request.headers['magic_key']
#     app.logger.info(magic_key)
#     chat_id = int(request.headers['chat_id'])
#     app.logger.info(chat_id)
#     # Verify that the magic key is corret wrt chat id
#     status = "failed"
#     if chats[chat_id]['magic_key'] == magic_key:
#         app.logger.info("Being added now!")
#         appendUser(chat_id, username)
#         status = "success"

#     jsonRet = {
#         'status': status,
#         'username': username,
#     }
#     return make_response(jsonify(jsonRet), 200)


# @app.route('/getChatsforUser', methods=['GET'])
# def getChats():
#     app.logger.info("came here to get chats for given user")
#     auth_key = request.headers['auth_key']
#     app.logger.info(auth_key)
#     username = users[auth_key][0]
#     app.logger.info(username)
#     userChats = {}
#     for chat_id, value in chats.items():
#         if username in value['authorized_users']:
#             userChats[chat_id] = value['magic_key']
#     app.logger.info(f"these are the chats for this user: {userChats}")

#     jsonRet = {
#         'userChats': userChats,
#         'username': username,
#     }
#     return make_response(jsonify(jsonRet), 200)


@app.route('/newchat', methods=["POST"])
def newchat():
    app.logger.info("got here to new chat after login")
    app.logger.info('currently existing chats are:')
    app.logger.info(chats)
    jsonRec = request.get_json()
    auth_key = jsonRec['auth_key']
    app.logger.info(auth_key)
    # get username from auth_key
    username = users[auth_key][0]
    app.logger.info(username)
    # create a chat
    chat = newChat(username)
    magic_key = chat['magic_key']
    # get chat id
    chat_id = len(chats.keys()) + 1
    # add chat to that id
    chats[chat_id] = chat
    app.logger.info(chats)
    # prepare json to return
    jsonRet = {
        'chat_id': chat_id,
        'auth_key': auth_key,
        'magic_key': magic_key
    }
    return make_response(jsonify(jsonRet), 200)


@app.route('/messages', methods=["POST", "GET"])
def messages():
    if request.method == 'POST':
        app.logger.info(f"chats now: {chats}")
        app.logger.info(f"Chats right now: {chats}")
        jsonRec = request.get_json()
        app.logger.info(f"this is what i got {jsonRec}")
        chat_id = int(jsonRec['chat_id'])
        # app.logger.info(f"my chat id for post is {chat_id}")
        message = jsonRec['message']
        # app.logger.info(f"my message for post is {message}")
        auth_key = jsonRec['auth_key']
        app.logger.info(f"users in system are: {users}")
        username = users[auth_key][0]
        messageToAppend = {'username': username, 'body': message}
        messages = chats[chat_id]['messages']
        if (len(messages) > 30):
            messages.pop(0)
        else:  # check if this user is authorized to post
            if username in chats[chat_id]['authorized_users']:
                messages.append(messageToAppend)
        app.logger.info(messages)
        postedMessage = messageToAppend
        app.logger.info(f"chats after: {chats}")
        return jsonify(postedMessage)

    if request.method == 'GET':
        app.logger.info("got into GET")
        time.sleep(0.5)
        chat_id = int(request.headers['chat_id'])
        messages = chats[chat_id]['messages']
        rv = {'messages': messages}
        app.logger.info(f"return json: {rv}")
        return make_response(jsonify(rv))
