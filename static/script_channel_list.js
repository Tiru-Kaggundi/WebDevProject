
class Channels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelsList: [],
    }
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
            <li key={channel[1]} onClick={() => this.props.currentChannelID(channel[0])}>{channel[1]}</li>); //this is sending the clicked channel value back to parent who calls this function
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


class CreateNewChannel extends React.Component { 
    render() {
        return (
            <h3>Create New Channel</h3>
        ); 
    }
}