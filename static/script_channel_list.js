
//create Channels module
function Channels() {
  console.log("Came to channel")
  const tiru_auth_key = window.location.tiru_auth_key;
  if (checkAuthkey(tiru_auth_key)) {
    fetch("http://127.0.0.1:5000/api/getChannels", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'tiru_auth_key': tiru_auth_key
      }
    }).then((response) => {
      if (response.status == 200) {
        console.log("Got response of channels")
        const channels = response.json()
        console.log(channels);
        const channelList = channels.map((channel) =>
          <li>{channel}</li>);
        return channelList;
      } else {
        console.log("Couldn't get the Channel list ");
      }
    });
  }
}

// class Channels extends React.Component {
//   constructor(props) {
//     super(props);
//     this.getChannels = this.getChannels.bind(this);
//     this.state = {
//       isLoggedIn: false,
//       tiru_auth_key: window.localStorage.getItem("tiru_auth_key"),
//       channels: ''
//     };
//     console.log("Came to channel");
//     console.log("Set state of logged in to false, Checking for auth_key validity");
//     if (checkAuthkey(this.state.tiru_auth_key)) {
//       this.setState({'isLoggedIn': true})
//     } else {
//       console.log("Show login window: User not logged in")
//     }
//   }

//   getChannels = () => {
//     if (this.state.isLoggedIn) {
//       fetch("http://127.0.0.1:5000/api/getChannels", {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'tiru_auth_key': this.state.tiru_auth_key
//       }
//       }).then((response) => {
//         if (response.status == 200) {
//           console.log("Got response of channels")
//           const channels = response.json().Channels;
//           console.log(channels)
//           const channelList = channels.map((channel) => 
//             <li>{channel}</li>);
//           this.setState({'channels': channelList})
//       } else {
//         alert("Couldn't get the Channel list ");
//       }
//       });
//     }
//   }
//   render() {
//     this.getChannels();
//     return (
//       <div className="channeList">
//         <h2>Channels: </h2>
//         <ul>{this.state.channels}</ul>
//       </div>
// );
//   }
// }

