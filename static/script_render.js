
class Belay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentChannelID: '',
      replies: '',
      username: '',
      auth_key: '',
    }
  }
    
    handleCallbackChannelID = (currentChannelReceived) => {
        this.setState({ currentChannelID: currentChannelReceived })
    }

    render() {
        console.log("State inside main: ", this.state);
    return (
      <div>
        <div>
          <TitleBar />
          <SignupAndLogin />
        </div>
        <div className="main">
                <Channels currentChannelID = {this.handleCallbackChannelID}/> 
          <div className="messages">
                    <Posts currentChannelID={this.state.currentChannelID} />
            <Compose />
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