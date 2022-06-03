# Final Project: Belay (a Slack clone)

README:

It's a 3 column design - extremely unfriendly UI as of now. Does all basic stuff, of authentication, posting channels, messages, replies etc. Counts unread and displays. 
Once the DB is created (which I named as belayDB)
you can run the script to create tables at 20220315T224504_create_tables.sql
Thereafter, it just simple flask run (after setting FLASK APP to app) 
It looks horrible, but it does basic things. 

What it doesn't do yet 
- pushes history, tries to read the pop history, but fails to load.
- the image integration to parse out the image links from messages is not yet done
- Horrible media friendliness. It was kept for the end, and the end never came! 


### Introduction

This is a smaller (significantly smaller in scope) version of the popular workplace
messaging app Slack. We'll call our version [Belay](https://en.wikipedia.org/wiki/Belaying).

### What it does

- Belay lets users send and read real-time chat messages that are organized
  into rooms called Channels. Users see a list of all the channels on the server
  and can click one to enter that channel. Inside, they see all the messages
  posted to that channel by any user, and can post their own messages.
  All messages belong to a channel and all channels are visible to all users; we
  don't need to implement private rooms or direct messages.
- Any user can create a new channel by supplying a display name. Channel names
  must be unique. You may choose to limit what characters are allowed in channel
  names if you wish.
- Like Slack, messages may be threaded as Replies in response to a message in a
  channel. Messages in the channel will display how many replies they have if
  that number is greater than zero. We don't support nested threads;
  messages either belong directly to a channel or are replies in a thread to a
  message that does, but replies can't have nested replies of their own.

 


