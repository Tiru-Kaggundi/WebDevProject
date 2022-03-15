
class Belay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: '',
      replies: '',
      username: '',
      auth_key: '',
    }
  }

  render() {
    return (
      <div>
        <div>
          <TitleBar />
          <SignupAndLogin />
        </div>
        <div className="main">
          <Channels /> 
          <div className="messages">
            <Posts />
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