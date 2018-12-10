import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

class Paused extends React.Component {


  resume(){
    const startClock = () => {
      db.collection("games").doc(this.props.gameName)
      .update({
        status:'active'
      })
    }
    let resumeButton;
    if(this.props.creator){
      resumeButton = (<button id="greenButton" style={{marginTop:'15px'}}
                              onClick={startClock}> Resume! </button>)
    }
    return resumeButton
  }


  render(){
    return (
      <div>
        <h1>Paused</h1>
        <h4>Rules:</h4>
        <ul className="rulesList">
          <li> Each round lasts one minute. </li>
          <li> Players may skip one phrase per turn. </li>
          <li> Your team earns two points when they succesfully guess your phrase. </li>
          <li> Skipping a phrase costs your team -1 points. </li>
          <li> The game ends when all phrases have been guessed. </li>
        </ul>
      {this.resume()}
      </div>
    )
  }
}

export default Paused;
