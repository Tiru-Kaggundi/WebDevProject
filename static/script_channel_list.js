
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
        this.setState({ channelsList: Object.values(data)[0] });
        console.log("array is:", this.state.channelsList);
    });
  }
    render() {
        const channels = this.state.channelsList.map((channel) =>
            <li key={channel}>{channel}</li>);
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