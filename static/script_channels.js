
class Channels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelsList: []
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => this.refresh(), 1000);
  }

  componentWillUnmount() {
    this.timer = null;
    console.log("Channels list unmounting");
  }
    
  refresh(){
    const tiru_auth_key = window.localStorage.getItem("tiru_auth_key");
    fetch("http://127.0.0.1:5000/api/getChannels", {
      method: 'GET',
      headers: {'Content-Type': 'application/json', 'tiru_auth_key':tiru_auth_key}
    })
    .then((response) => response.json())
    .then((data) => {
        this.setState({ channelsList: data.channels });
      console.log("array is:", this.state.channelsList);
    });
  }
    
  render() {
        const channels = this.state.channelsList.map((channel) =>
            <button key={channel[1]} onClick={() => this.props.currentChannelID(channel[0])}>{channel[1] + " : " + channel[2] +" unread"}</button>); //this is sending the clicked channel value back to parent who calls this function
        console.log(channels);
    return (
        <div className="channelsList" id="channels">
            <h3>Channels</h3>
        <ul>{channels}</ul>
        </div>
    );
    }
}

//<button onClick={() => this.refresh()}>Refresh</button>

class CreateNewChannel extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
          currentChannelID: '',
      } 
  }
    createChannel() {
      const channelName = document.getElementById("channelName").value;
      const session_token = window.localStorage.getItem("tiru_auth_key");
      const url = "http://127.0.0.1:5000/api/createChannel"
      fetch(url, {
          method: 'POST',
          headers: {
              'tiru_auth_key':session_token,
              'Content-Type': 'application/json',
              'channelName': channelName
          }
      })
    .then((response) => response.json())
          .then((data) => {
              console.log("channel Created with ID: ", data.currentChannelID);
              this.setState({ currentChannelID: data.currentChannelID });
              document.getElementById("channelName").value = "";
    });
    }
    render() {
        return (
        <div className="newChannel" id="newChannel">
            <textarea id="channelName"></textarea>
            <button className="form_button" onClick={() => this.createChannel()}>
                Create New Channel
            </button>
            </div>
    );
  } 
}
