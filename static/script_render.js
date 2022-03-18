
class Belay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { // this state setting is working fine and the values are updating properly. Ready to pass down to children
      currentChannelID: '',
      currentUser: '',
      tiru_auth_key: '',
      messageID: ''
    }
  }
    
    componentDidMount() {
        console.log("Component mounted and the state is: ", this.state)
    }
    
    handleCallbackChannelID = (currentChannelReceived) => {
        this.setState({ currentChannelID: currentChannelReceived })
    }
  
    handleCallbackmessageID = (messageIDReceived) => {
        this.setState({ messageID: messageIDReceived })
    }

    handleCallbackCurrentUser = (currentUser) => {
        this.setState({ currentUser: currentUser })
        this.setState({tiru_auth_key: window.localStorage.getItem("tiru_auth_key")}) //auth_key resides in localstorage upon login
    }

    render() { // remember that you can send who state from here to any child item rather than sending one or two e.g. this.state will send down channel_id, username and auth_key
        console.log("State MAIN: ", this.state);
    return (
      <div>
        <div className="titlebar">
          <TitleBar />
                <SignupAndLogin currentUser={this.handleCallbackCurrentUser}/> 
        </div>
            <div className="main">
                <div className="sidebar">
                    <Channels currentChannelID={this.handleCallbackChannelID} />
                    <CreateNewChannel/>
                </div>
                <div className="messages"> 
            <Posts currentChannelID={this.state.currentChannelID} messageID={this.handleCallbackmessageID}/> 
                    <Compose currentChannelID={this.state.currentChannelID}/>
          </div>
          <div className="replies">
            <Replies messageID={this.state.messageID} currentChannelID={this.state.currentChannelID} />
            <CreateReply messageID={this.state.messageID} currentChannelID={this.state.currentChannelID}/>
          </div>
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

ReactDOM.render(
  React.createElement(Belay),
  document.getElementById('root')
);