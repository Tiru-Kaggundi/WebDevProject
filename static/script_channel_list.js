
class Channels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentChannel: '',
      channelsList: [],
    }
  }
    
    getMessages(channel_id) {
        console.log("let's get the messages from database for channel id: ", channel_id);
        this.setState({ currentChannel: channel_id })
        this.props.currentChannelID(channel_id)
        console.log("State: ", this.state) //it runs one behind as it prints first and sets state later?
        sendingMessage(channel_id);
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
            <li key={channel[1]} onClick={() => this.getMessages(channel[0])}>{channel[1]}</li>); //send this directly later to pollMessages
        console.log(channels);
    return (
        <div className="channelsList" id="channels">
            <h3>Channels</h3>
        <ul>{channels}</ul>
        <button onClick={() => this.refresh()}>Refresh</button>
        </div>
    );
    }
}