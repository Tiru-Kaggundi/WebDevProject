
class SignupAndLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: true,
    };
  }

  signup = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:5000/api/signup", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: username, password: password})
    }).then((response) => {
      if(response.status == 200) {
        alert("Created user "+username + " You may login now");
      } else {
        alert("A user "+username+" already exists");
      }
    });
  }

  login = () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    this.setState({display: false});

    fetch("http://127.0.0.1:5000/api/login", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: username, password: password})
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          window.localStorage.setItem("session_token", data.session_token);
          document.getElementById("posts").setAttribute('style', 'display: block;');
          document.getElementById("compose").setAttribute('style', 'display: block;');
        });
        alert("Logged in as "+username);
      } else {
        alert("Incorrect username and password");
      }
    });
  }



  render() {
    return (
      <div className="signup">
        <h1>Signup and Login</h1>
        <div className="signup_form">
          <label htmlFor="username">Username</label>
          <input id="username"></input>
          <label htmlFor="password">Password</label>
          <input id="password" type="password"></input>
          <button className="form_button" onClick={this.signup}>
            Signup
          </button>
          <button className="form_button" onClick={this.login}>
            Login
          </button>
        </div>
      </div>
    );
  }
}



class Compose extends React.Component {
  post() {
    const title = document.getElementById("compose_title").value;
    const body = document.getElementById("compose_body").value;
    const session_token = window.localStorage.getItem("journal_session_token");

    fetch("http://127.0.0.1:5000/api/post", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        session_token: session_token,
        title: title,
        body: body
      })
    }).then(() => {
      document.getElementById("compose_title").value = "";
      document.getElementById("compose_body").value = "";
    });
  }

  render() {
    return (
      <div className="compose" id="compose">
        <h2>Compose</h2>
        <div className="post_form">
          <label htmlFor="compose_title">Title</label>
          <input id="compose_title"></input>
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

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
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
        <h3>{post.title}</h3>
        <div>{post.body}</div>
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

Posts.propTypes = {
  posts: window.PropTypes.array
}

class Journal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      username: null,
      password: null,
      session_token: null,
    }
  }

  // usernameHandler = (username) => {
  //   this.setState({ username: username });
  // }
  // passwordHandler = (password) => {
  //   this.setState({ password: password });
  // }

  // loginHandler() {
  //   // TODO: update this call by managing State
  // }

  // logoutHandler() {
  //   // TODO: replace this call by managing State
  // }

  render() {
    return (
      <div>
        <div>
          <TitleBar/>
        </div>
        <div className="weblog">
          <SignupAndLogin />
          <Compose />
          <Posts />
        </div>
      </div>
    );
  }
}

function TitleBar() {
  return (
    <div className="title_bar">
      <h1>Belay Chat</h1>
    </div>
  );
}

// ========================================


ReactDOM.render(
  React.createElement(Journal),
  document.getElementById('root')
);
