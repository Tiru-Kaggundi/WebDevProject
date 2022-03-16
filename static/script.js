//login module begins
class SignupAndLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      username: ''
    };
    console.log("Set state of logged in to false")
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

    fetch("http://127.0.0.1:5000/api/login", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: username, password: password})
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          window.localStorage.setItem("tiru_auth_key", data.tiru_auth_key);
          this.setState({ isLoggedIn: true });
          console.log("Changed state to logged in true")
        });
        alert("Logged in as " + username);
        this.props.currentUser(username); //send the value up to the parent who called this function
        this.setState({ 'username': username }) // sets the state to current username
      } else {
        alert("Incorrect username and password");
      }
    });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const username = this.state.username;
    if (!isLoggedIn) {
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
    } else {
      return (
        <h1> Welcome  {username} </h1>
      )
    }
  }
}
// Login module over

//auth key checker function - will be needed everytime
function checkAuthkey(tiru_auth_key) {
  return true; //to be changed later to check from DB and get back 1 or 0
}

function getUserfromAuthkey(auth_key) {

}
