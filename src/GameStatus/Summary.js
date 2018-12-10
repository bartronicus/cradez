import React from 'react'
import firebase from 'firebase/app';
import 'firebase/firestore';


var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

class Summary extends React.Component{

  constructor(props){
    super(props);
    this.showBanner = this.showBanner.bind(this)
    this.newGameFirestore = this.newGameFirestore.bind(this)
  }


  _winner = [];
  _loser = [];

  componentDidMount(){
    //listen for the new game call
    //if the creator selects new game it's pushed to firestore
    //navigates to action input page, with same game and player names
    db.collection("games").doc(this.props.gameName)
    .onSnapshot(snapshot => {
      snapshot.data().reset && this.props.navigate('setUp')
    });
  }


  componentWillUnmount(){
    db.collection('games').doc(this.props.gameName)
    .update({
      reset:false
    })
  }




  renderTeam(teamname){
     let teamElements = [];
     let players = this.props.players
     for(var player in players){
       if(players[player]['team']===teamname){
         let score = players[player]['score']
         let name = players[player]['name']
         teamElements.push(
           <tr key={player}><td>{name}</td><td>{score}</td></tr>
         );
       }
     }
     return teamElements;
  }

  newGameFirestore(){
    //reset all game values
    let players = this.props.players
    for(var player in players){
      players[player]['score'] = 0;
    }
    db.collection("games").doc(this.props.gameName)
    .update({
      players:players,
      turn:0,
      transitioning:false,
      status:'active',
      redTeamPoints:0,
      blueTeamPoints:0,
      reset:true
    })
    this.props.navigate('actions')
  }

  newGameButton(){
    return <button id="yellowButton" style={{marginTop:'30px'}}
    onClick={this.newGameFirestore}>New Game</button>
  }

  winnerNameBanner() {
    let summaryButtonColor;
    if(this.props.redTeamPoints === this.props.blueTeamPoints){
      return <h1> style={{color:'limegreen'}}>We did a Tie!</h1>
    } else {
      this.props.redTeamPoints === this.props.blueTeamPoints ?
        summaryButtonColor = 'redTeamColor' :
        summaryButtonColor = 'blueTeamColor';
      return <h1 style={{color:summaryButtonColor}}>  wins!</h1>
    }
  }

  showBanner(){
    this.setState(state=>({
      paymentForm:'paymentForm',
      requestBanner:'hidden'
    }))
  }


  render(){
    if(this.props.redTeamPoints > this.props.blueTeamPoints){
      this._winner = ['red team',this.props.redTeamPoints,'redTeamScoreBox','violet'];
      this._loser = ['blue team',this.props.blueTeamPoints,'blueTeamScoreBox','aqua'];
    } else {
      this._winner = ['blue team',this.props.blueTeamPoints,'blueTeamScoreBox','aqua'];
      this._loser = ['red team',this.props.redTeamPoints,'redTeamScoreBox','violet'];
    }

    return(
      <div>
        <h1 style={{color:this._winner[3],textShadow:'2px 2px 3px black'}}>{this._winner[0]} wins!</h1>
        <section>
          <table id={this._winner[2]}>
            <tbody>
              <tr><th><h3> {this._winner[0]} </h3></th><th><h3>{this._winner[1]}</h3></th></tr>
              {this.renderTeam(this._winner[0])}
            </tbody>
          </table>
          <table id={this._loser[2]}>
            <tbody>
              <tr><th><h3> {this._loser[0]} </h3></th><th><h3>{this._loser[1]}</h3></th></tr>
              {this.renderTeam(this._loser[0])}
            </tbody>
          </table>
        </section>
        {this.newGameButton()}
        <div>

        </div>
      </div>

    )
  }
}

export default Summary
