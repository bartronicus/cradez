import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ActivePlayer from './ActivePlayerScreen.js';
import WatchGame from './WatchGame.js'
import Transition from './Transition.js'
import Summary from '../GameStatus/Summary.js'
import Header from './Header.js'
import SimpleStorage from "react-simple-storage";

var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});


class ManageGame extends React.Component {
  constructor(props){
    super(props);
    this.docRef = db.collection("games").doc(this.props.gameName);
    this.state = {
      activePlayer:'',
      transitioning:true,
      actions:'',
      nouns:''
    }
  }


  componentDidMount(){
    //get the active players
    //and use the transitioning status
    this.unsubscribe = this.docRef
    .onSnapshot(snapshot => {
      let snap = snapshot.data();
      //get just the player name from the current player object
      this.setState(state=>({
        activePlayerIndex:snap.activePlayerIndex,
        activePlayer:snap.players[snap.activePlayerIndex]['name'],
        players:snap.players,
        transitioning:snap.transitioning,
        nouns:snap.nouns,
        actions:snap.actions,
        turn:snap.turn,
        blueTeamPoints:snap.blueTeamPoints,
        redTeamPoints:snap.redTeamPoints,
        status:snap.status,
      }))
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    return(
      this.state.status==='winner' ?
        <div>
        <SimpleStorage parent={this}/>
        <Summary
          blueTeamPoints = {this.state.blueTeamPoints}
          redTeamPoints = {this.state.redTeamPoints}
          creator = {this.props.creator}
          players = {this.state.players}
          navigate = {this.props.navigate}
          gameName = {this.props.gameName}
        />
        </div> :
      this.state.transitioning===true ?
        <div>
            <SimpleStorage parent={this}/>
           <Header
             navigate = {this.props.navigate}
             gameName = {this.props.gameName}
             creator = {this.props.creator}
           />
           <Transition
             activePlayer = {this.state.activePlayer}
             activePlayerIndex={this.state.activePlayerIndex}
             gameName = {this.props.gameName}
             creator = {this.props.creator}
             status = {this.state.status}/>
        </div> :
       this.state.activePlayer === this.props.playerName ?
          <div>
            <SimpleStorage parent={this}/>
            <Header
              navigate = {this.props.navigate}
              gameName = {this.props.gameName}
              creator = {this.props.creator}
            />
            <ActivePlayer
              activePlayerIndex={this.state.activePlayerIndex}
              gameName = {this.props.gameName}
              nouns = {this.state.nouns}
              actions = {this.state.actions}
              turn = {this.state.turn}
              playerName = {this.props.playerName}
              numberOfClues = {this.state.actions.length}
              creator = {this.props.creator}/>
          </div> :
          <div>
            <SimpleStorage parent={this}/>
            <Header
              navigate = {this.props.navigate}
              gameName = {this.props.gameName}
              creator = {this.props.creator}
            />
            <WatchGame
              activePlayerIndex = {this.state.activePlayerIndex}
              activePlayer = {this.state.activePlayer}
              players = {this.state.players}
              clock = {this.state.clock}
              gameName = {this.props.gameName}
              blueTeamPoints = {this.state.blueTeamPoints}
              redTeamPoints = {this.state.redTeamPoints}
              creator = {this.props.creator}
            />
          </div>
    )
  }
}







export default ManageGame;
