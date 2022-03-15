function sendingMessage(channel_id) {
    console.log("Got this channel id (from fn): ", channel_id)
}


class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentChannelID: this.props.currentChannelID, //need to fix it, it's not getting updated, fornow use props.currentchannelID
        posts: [{ 'id': 1, 'body': 'Ipsum' }, { 'id': 2, 'body': 'Lorem' }]
    }
  }

  refresh(){
    const session_token = window.localStorage.getItem("journal_session_token");
    fetch("http://127.0.0.1:5000/api/post", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({session_token: session_token})
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({posts: data});
    });
  }

  render() {
    const posts = this.state.posts.map((post) =>
      <div key={post.id} id={"post_" + post.id}>
        <div>{post.body}</div>
        </div>
    );
      console.log("State: ", this.state)
      console.log('props: ', this.props)
    console.log("Got this channel id (from react component): ", this.state.currentChannelID);

    return ( 
      <div className="posts" id="posts">
        <h2>Posts</h2>
        <button onClick={() => this.refresh()}>Refresh</button>
        {posts}
      </div>
    );
  }
}

// Posts.propTypes = {
//   posts: window.PropTypes.array
// }
