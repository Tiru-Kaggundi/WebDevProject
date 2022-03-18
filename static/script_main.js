
class Belay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { // this state setting is working fine and the values are updating properly. Ready to pass down to children
      currentChannelID: '',
      currentUser: '',
      tiru_auth_key: window.localStorage.getItem("tiru_auth_key"),
      messageID: '',
      goBack: true,
      showChannelPosts: false
    }
  }

  componentDidMount() {
    //Case 1: Histroy popstate triggers a load
    window.addEventListener("popstate", () => {
      console.log("pop event called");
      let url = window.location.pathname;
      let urlSplit = url.split('/');
      console.log("total split", urlSplit);
      if (this.state.tiru_auth_key) {
        if (urlSplit.length > 3) {
          //split[3] is channel id, and split[4] is message id
          let next_channelID = urlSplit[3];
          let next_messageID = urlSplit[4];
          return <Belay next_channelID={next_channelID} next_messageID={next_messageID} />;
        } else if (urlSplit.length === 3) {
          let next_channelID = urlSplit[3];
          return <Belay next_channelID={next_channelID} next_messageID={next_messageID} />
        } else {
          return <Belay tiru_auth_key={tiru_auth_key} />
        }
      }
      else {
        <Belay />
      }
    });
    // An organic call to root makes the page load (check authentication first)
    if (this.state.tiru_auth_key) {
      console.log("User already logged in")
      // get username and update state
      fetch("http://127.0.0.1:5000/api/getUsername", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'tiru_auth_key': this.state.tiru_auth_key }
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ currentUser: data.currentUser });
          console.log("got back username and updated state:", this.state.currentUser);
        });
    }
    else {
      console.log("User not logged in")
    }

    //Case 3: someone pastes a link to an api endpoint. 
      window.addEventListener('DOMContentLoaded', () => {
      console.log("DOM content loaded even called");
      //window.addEventListener("load", () => console.log("load event called"));
  });
}

    handleCallbackChannelID = (currentChannelReceived) => {
      this.setState({ currentChannelID: currentChannelReceived });
      const url = "http://127.0.0.1:5000/api/channel/" + this.state.currentChannelID;
      history.pushState(null, null,  url);
      this.setState({ showChannelPosts: true });
    }
  
    handleCallbackmessageID = (messageIDReceived) => {
      this.setState({ messageID: messageIDReceived });
      this.setState({ goBack: false });
      const url = "http://127.0.0.1:5000/api/channel/" + this.state.currentChannelID + "/" + this.state.messageID;
      history.pushState(null, null, url);  
    }

    handleCallbackCurrentUser = (currentUser) => {
        this.setState({ currentUser: currentUser })
    }
  
    handleCallbackgoBack = (goBackstatus) => {
        this.setState({ goBack: goBackstatus })
    }
  
  shouldComponentUpdate(next_channelID, next_messageID) {
    if ((next_channelID !== this.state.currentChannelID) || (next_messageID !== this.state.messageID))  {
      return true;
    } else {
      return false;
    }
  }
  

    render() { // remember that you can send who state from here to any child item rather than sending one or two e.g. this.state will send down channel_id, username and auth_key
        console.log("State MAIN: ", this.state);
    return (
      <div>
        <div className="titlebar">
          <TitleBar />
          {this.state.currentUser && <h2> Welcome {this.state.currentUser} </h2>}
          {!this.state.currentUser &&
            <SignupAndLogin currentUser={this.handleCallbackCurrentUser} />}
        </div>
        {this.state.currentUser && <div className="main">
          <div className="sidebar">
            <Channels currentChannelID={this.handleCallbackChannelID} />
            <CreateNewChannel />
          </div>
          {this.state.showChannelPosts &&
            <div className="messages">
              <Posts currentChannelID={this.state.currentChannelID} messageID={this.handleCallbackmessageID} />
              <Compose currentChannelID={this.state.currentChannelID} />
            </div>}
          {!this.state.goBack &&
            <div className="replies">
              <Replies messageID={this.state.messageID} currentChannelID={this.state.currentChannelID} goBack={this.handleCallbackgoBack} />
              <CreateReply messageID={this.state.messageID} currentChannelID={this.state.currentChannelID} />
            </div>}
        </div>}
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

ReactDOM.render(
  React.createElement(Belay),
  document.getElementById('root')
);