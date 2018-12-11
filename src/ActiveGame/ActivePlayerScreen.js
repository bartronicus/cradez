import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Paused from './Paused.js'
import SimpleStorage from "react-simple-storage";

var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

class ActivePlayer extends React.Component {
  constructor(props){
    super(props)
    this.docRef = db.collection("games").doc(this.props.gameName)
    this.state={
      clock:60
    }
    this.incrementTheTurnAndPoints = this.incrementTheTurnAndPoints.bind(this);
    this.skipQuestion = this.skipQuestion.bind(this);
  }

  _isMounted = false;

    //controls the in game timer per round
    counter(){
      let second = this.state.clock
      if(this._isMounted){
        this.timer=setInterval(()=>{
          if(this.state.status !== 'paused'){
            second > 1 ? second -- : second = 'Time\'s Up!'
              this.setState(state=>({
                clock:second
              }))
            if(second === 'Time\'s Up!'){
              db.collection("games").doc(this.props.gameName)
              .update({
                transitioning:true
              })
            }
          }
       },1000,second)
     }
   }


   //read the database for player points and team
  componentDidMount(){
    this._isMounted=true;
    if(this._isMounted){
      this.counter();
      this.unsubscribe = this.docRef
      //get the points and player object to update when needed
      .onSnapshot(snapshot=> {
        let snap = snapshot.data()
        let players = snap.players
        let playerName = players[snap.activePlayerIndex]['name']
        let playerObject = players[snap.activePlayerIndex]
        let points = playerObject['score']
        let redTeamPoints = snap['redTeamPoints'];
        let blueTeamPoints = snap['blueTeamPoints'];
        let activePlayerIndex = snap['activePlayerIndex']
        let status = snap.status
        //add to state.  keep track of player stats in state in case db is lagging
        this.setState(state=>({
          status:status,
          turn:this.props.turn,
          activePlayerIndex:activePlayerIndex,
          players:players,
          playerObject:playerObject,
          playerName:playerName,
          points:points,
          redTeamPoints:redTeamPoints,
          blueTeamPoints:blueTeamPoints
        }))
      })
    }
  }

  componentWillUnmount(){
    this._isMounted=false;
    clearInterval(this.timer)
    //UPDATE activePlayerIndex
    let newIndex;
    if(this.state.players){
      this.state.activePlayerIndex === this.state.players.length-1 ?
      //cycle back to first player if needed
        newIndex = 0 :
        newIndex = this.state.activePlayerIndex+1
      db.collection("games").doc(this.props.gameName)
      .update({
        turn:this.state.turn,
        activePlayerIndex:newIndex
      })
      this.unsubscribe();
    }
  }

  incrementTheTurnAndPoints(){
    //get the team to increment the teams points in db
    let team;
    this.state.playerObject['team']==='red team' ?
      team = 'redTeamPoints' :
      team = 'blueTeamPoints' ;
    let points = this.state.points + 2
    let playerObj = this.state.playerObject
    playerObj['score'] = points
    //add this player object back to the players array with their modified score
    let players = this.state.players
    players[this.state.activePlayerIndex] = playerObj
    this.setState(state=>({
      //turn:this.state.turn+1,
      points:points,
      [team]:this.state[team]+2,
      playerObject:playerObj,
      players:players
    }))
    db.collection("games").doc(this.props.gameName)
    .update({
      turn:this.state.turn+1,
      players:players,
      [team]:this.state[team]+2
    })
    //check if anyone has won
    if(this.state.turn+1 === this.props.numberOfClues){
      //this will direct all players to the summary page
      db.collection("games").doc(this.props.gameName)
      .update({
        status:'winner'
      })
    }
  }

  skipQuestion(){
    //get the current noun and action
    let turn = this.state.turn;
    let currentNoun = this.props.nouns[turn]
    let currentAction = this.props.actions[turn]
    //generate random indexes to insert

    //the minimum range to use for the random index
    //position the words at least 2 indexes away,
    //unless it's the last question
    let minimum;
    turn < this.props.nouns.length ? minimum = turn+2 : minimum = turn+1;

    let newNounIndex = Math.floor(Math.random()*(this.props.nouns.length-minimum)+minimum)
    let newActionIndex = Math.floor(Math.random()*(this.props.nouns.length-minimum)+minimum)
    //insert into the arrays
    let nouns = this.props.nouns
    let actions = this.props.actions
    nouns.splice(newNounIndex,0,currentNoun)
    actions.splice(newActionIndex,0,currentAction)


    //get the team to decrement the teams points in db
    let team;
    this.state.playerObject['team']==='red team' ?
      team = 'redTeamPoints' :
      team = 'blueTeamPoints' ;
    let points = this.state.points - 1
    let playerObj = this.state.playerObject
    playerObj['score'] = points

    //add this player object back to the players array with their modified score
    let players = this.state.players
    players[this.state.activePlayerIndex] = playerObj
    this.setState(state=>({
      //turn:this.state.turn+1,
      points:points,
      [team]:this.state[team]-1,
      playerObject:playerObj,
      players:players,
      skipped:true
    }))
    db.collection("games").doc(this.props.gameName)
    .update({
      nouns:nouns,
      actions:actions,
      turn:this.state.turn+1,
      players:players,
      [team]:this.state[team]-1
    })

  }

  render(){
    //show the skip button if user is not on the last question
    //and if they have not yet used a skip
    const skipButton = () => {
      if(this.state.turn < this.props.nouns.length-1 && !this.state.skipped){
        return(
          <button id="yellowButton" className="skipButton" onClick={this.skipQuestion}><h2>Skip</h2><h3>(-1)</h3></button>
        )
      }
    }
    return(
      this.state.status!=='paused' ?
        <div  id="activePlayerScreen">
          <SimpleStorage parent={this}/>
          <h3>{this.props.nouns[this.state.turn] + ' ' + this.props.actions[this.state.turn]}</h3>
          <button className="nextButton" id="aquaButton" onClick={this.incrementTheTurnAndPoints}><h2>Next</h2><h3>(+2)</h3></button>
          <h1>{this.state.clock}</h1>
          {skipButton()}
        </div> :
          <Paused
            creator = {this.props.creator}
            gameName = {this.props.gameName}
          />
    )
  }
}

export default ActivePlayer;
