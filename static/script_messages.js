// Script to handle displaying posts in a channel and also to take in new messages
// into a channel

class Posts extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        posts: []
      }
  }

    // convert this refresh in set internval using 5.state and lifecycle react tutorial
    refresh() {
      const session_token = window.localStorage.getItem("tiru_auth_key");
      const url = "http://127.0.0.1:5000/api/channel/" + this.props.currentChannelID
      fetch(url, {
          method: 'GET',
          headers: {
              'tiru_auth_key':session_token,
              'Content-Type': 'application/json'
          }
      })
    .then((response) => response.json())
          .then((data) => {
              console.log("Got this json from server (data): ", data);
              this.setState({ posts: data.posts });
    });
    }

  render() {
    const url = "http://127.0.0.1:5000/api/channel/" + this.props.currentChannelID;
    history.pushState(null, null, url);
    const posts = this.state.posts.map((post) =>
      <div key={post[0]} id={"post_" + post[0]}>
            <div key={"msg_+" + post[0]}>{post[2]}</div>
        <div key={"author_+" + post[1]}>{post[1]}</div>
        <button key={"replies_to_" + post[0]} onClick={() => this.props.messageID(post[0])}>Replies: {post[3]}</button> 
        </div>
    );

    return ( 
      <div className="posts" id="posts">
        <h2>Posts</h2>
        <button onClick={() => this.refresh()}>Refresh</button> 
        {posts}
      </div>
    );
  }
}


//compose your message module
//auth_key goes in header which the server uses to figure out who is the user
class Compose extends React.Component {
  post() {
      const body = document.getElementById("compose_body").value;
      console.log("got this body of post: ", body);
      const session_token = window.localStorage.getItem("tiru_auth_key");
      const url = "http://127.0.0.1:5000/api/channel/" + this.props.currentChannelID;

    fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'tiru_auth_key': session_token},
      body: JSON.stringify({body: body})
    }).then(() => {
      document.getElementById("compose_body").value = "";
    });
  }

  render() {
    return (
      <div className="compose" id="compose">
        <h2>Compose your message</h2>
        <div className="post_form">
          <label htmlFor="compose_body">Post</label>
          <textarea id="compose_body"></textarea>
          <button className="form_button" onClick={() => this.post()}>
            Post
          </button>
        </div>
      </div>
    );
  }
}


class Replies extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        replies: []
      }
  }

  componentWillUnmount() {
    console.warn("Replies component is unmounting")
  }

    // convert this refresh in set internval using 5.state and lifecycle react tutorial
    refresh() {
      const session_token = window.localStorage.getItem("tiru_auth_key");
      const url = "http://127.0.0.1:5000/api/channel/" + this.props.currentChannelID + "/" + this.props.messageID;
      console.log("URL for replies:", url);
      fetch(url, {
          method: 'GET',
          headers: {
              'tiru_auth_key':session_token,
              'Content-Type': 'application/json'
          }
      })
    .then((response) => response.json())
          .then((data) => {
              console.log("Got this json from server (data): ", data);
            this.setState({ replies: data.replies });
    });
    }
  
  goBack() {
    console.log("design go back")
  }

  render() {
    const url = "http://127.0.0.1:5000/api/channel/" + this.props.currentChannelID + "/" + this.props.messageID;
    history.pushState(null, null, url);  
    const replies = this.state.replies.map((reply) =>
      <div key={reply[0]} id={"reply_" + reply[0]}>
            <div key={"rep_+" + reply[0]}>{reply[2]}</div>
            <div key={"author_+" + reply[1]}>{reply[1]}</div>
        </div>
    );
      console.log("State: ", this.state)
      console.log('props: ', this.props)
      console.log("Got this channel id (from react component): ", this.state.currentChannelID);
      console.log("Got this message id (from react component): ", this.state.messageID);

    return ( 
      <div className="replies" id="replies">
        <h2>Replies</h2>
        <button onClick={() => this.props.goBack(true)}>Go Back</button> 
        <button onClick={() => this.refresh()}>Refresh</button> 
        {replies}
      </div>
    );
  }
}



class CreateReply extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
          messageID: '',
      } 
  }
    createReply() {
      const body = document.getElementById("replyBody").value;
      const session_token = window.localStorage.getItem("tiru_auth_key");
      const url = "http://127.0.0.1:5000/api/channel/" + this.props.currentChannelID + "/" + this.props.messageID;
      fetch(url, {
          method: 'POST',
          headers: {'tiru_auth_key':session_token, 'Content-Type': 'application/json'}, 
          body: JSON.stringify({body: body})
      })
    .then((response) => response.json())
          .then((data) => {
              console.log("reply posted for author: ", data.author);
              document.getElementById("replyBody").value = "";
    });
    }
    render() {
        return (
        <div className="newReply" id="newReply">
            <textarea id="replyBody"></textarea>
            <button className="form_button" onClick={() => this.createReply()}>
                Reply
            </button>
            </div>
    );
  } 
}