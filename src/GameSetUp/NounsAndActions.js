import React from 'react'
import firebase from 'firebase/app';
import 'firebase/firestore';
import SmokeyBuff from '../svgs/smokeyBuff.js'
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});


//this will first generate inputs to collect playeractions
//and then generate inputs for nouns
//renders the 'waitingroom' component upon completion

//this componenet downloads any previously uploaded
//nouns or actions and saves them in localstate
//it saves the players words in local state as well
//and then combines them to reupload

class Words extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      inputType:'actions',
      warning:'',
      sass:'Try to be "creative!"',
      sassIndex:0,
      actions:['doing karaoke','dancing in a burning building','riding a camel'],
      nouns:['Harry Potter','Chewbacca','Bigfoot']
    }
    this.updateSass = this.updateSass.bind(this)
    this.renderInputs = this.renderInputs.bind(this)
    this.setWordsToState = this.setWordsToState.bind(this)
    this.uploadToFireBaseAndChangeState = this.uploadToFireBaseAndChangeState.bind(this)
    this.setPlaceholder = this.setPlaceholder.bind(this)
  }


  _isMounted = false;
  componentDidMount(){
    this._isMounted = true;
    let playerName = this.props.playerName
    console.log(playerName)
    let docRef = db.collection('games').doc(this.props.gameName)
    docRef.get().then(doc => {
      let docLength = Object.keys(doc.data()).length
      let team;
      docLength % 2 === 0 ? team = 'red team' : team = 'blue team';
      this.setState({
        playerCount:Object.keys(doc.data()).length,
        team:team
      })
    })
  };

  componentWillUnmount(){
    this._isMounted = false;
      //docRef.update({playerCount:num+1})
  }

  //changes what the buffalo is saying
  updateSass(){
    let sasses = ["Also try being funny!","oh you're the funny one","Wow, that's pretty funny!","Keep em coming","Soooo original!","I see"]
    this.setState(state=>({
      sassIndex:this.state.sassIndex===sasses.length-1?0:this.state.sassIndex+1,
      sass:sasses[this.state.sassIndex]
    }))
  }

  setWordsToState(type,index,value){
    //look at the players words in local state
    let inputs = this.state[type]
    inputs.splice(index,1,value)
    this.setState(state=>({
      [type]:inputs
    }))
  }



  uploadToFireBaseAndChangeState(){
    let inputs = document.getElementsByTagName('input');
    inputs = Array.from(inputs)
    let values = inputs.map(x=>x.value)
    //check if values are all entered
    //else produce warning
    let inputsAreEmpty = false;

    //check if any inputs are still empty
    values.forEach(x => {if(x === ''){inputsAreEmpty = true}})

    if(!inputsAreEmpty){
      //clear the input values
      inputs.forEach(input=>{input.value=''})

      //create player object
      let player = {
        name:this.props.playerName,
        score:0,
        nouns:this.state.nouns,
        actions:this.state.actions,
        team:this.state.team
      };

      //if player has set nouns and actions then upload the player object to db
      if(this.state.inputType==='nouns'){
        let docRef = db.collection("games").doc(this.props.gameName)
        docRef.update({
          [this.props.playerName]:player
        })
      }

      //remove warning message
        this.setState(state=>({
          warning:''
        }))
        //go to waiting room if nouns are input
        //else change input from actions to nouns in local state
       this.state.inputType==='nouns' ? this.props.navigate('gametime') : this.setState(state=>({inputType:'nouns',sass:'Wow! You\'re the funny one!'}))
    } else {
      this.setState(state=>({
        warning:'Please enter 3 items'
      }))
    }
  }

  // generates a random suggestion for the player to use
  setPlaceholder(nounOrAction,index){
    this.updateSass();
    const randoActions = ['crashing their bike','baking a pie','making out with a cactus','churning butter','painting a self portrait','hunting a dinosaur','robbing a bank','eating the forbidden apple','collecting nuts','giving a press conference','visiting italy','imitating Nicholas Cage','amputating limbs','having a nightmare','giving birth','quieting their upstairs neighbors','spying on their neighbors','crowd surfing','sky diving','meeting a llama','teaching a parrot to speak','hiding from a dino','teaching a dog how to swim','trying to ride a buffalo','being afraid of a clown','exploring the moon','crop dusting','applying for a loan','taking a bath','kissing a cactus']
    const randoNouns = ['Rambo','Miley Cyrus','Justin Beiber','Chewbacca','Han Solo','Bigfoot','An Alien','Harry Potter','Hagrid','Voldemort','Smeagle','A T-Rex','An Oompa Loompa','Indiana Jones','Frankenstein','A vampire','Alvin the chipmunk','A werewolf','Elmo','Kermit']
    let type;
    nounOrAction ==='actions' ? type = randoActions : type = randoNouns
    let suggestion = type[Math.floor(Math.random()*type.length)]
    let list = this.state[nounOrAction]
    list.splice(index,1,suggestion);
    this.setState(state=>({
      ['player'+nounOrAction]:list
    }))
    let inputs = document.getElementsByTagName('input');
    inputs = Array.from(inputs)
    inputs[index].value = suggestion
  }


  renderInputs(){
      let type = this.state.inputType
      let buttonId;
      type === 'actions' ? buttonId = 'greenButton' : buttonId = 'yellowButton'
      let inputs = [];
      this.state[type].forEach(
        (value,i) => {
        //TODO change to using refs!
        inputs.push(
          <div className="randomButtonRow" key={i+'div'}>
            <input
              maxLength={'30'}
              key={i+'action'}
              id={i}
              className="wordInput"
              onFocus={this.updateSass}
              onChange={(e)=>{this.setWordsToState(type,i,e.target.value)}}
              placeholder={value} />
            <button
              className="random"
              id={i}
              onClick={()=>{this.setPlaceholder(type,i)}}> +
              </button>
          </div>
      )}
    )
    inputs.push(<button id={buttonId} className="nextButton" key="submit" onClick={this.uploadToFireBaseAndChangeState}>Yup</button>);
    return inputs
  }


  render(){
    let wordType = 'actions'
    if(this.state.inputType === 'nouns') wordType = 'characters'
    return(
        <div>
          <p>Your game name is <span style={{color:'violet',fontWeight:900}}>{this.props.spacedGameName}</span></p>
          <p>Enter three {wordType} or click the + button for an auto suggestion</p>
          <h3>{wordType}</h3>
          {this.renderInputs()}
          <p style={{color:'red'}}>{this.state.warning}</p>
          <div id="buffaloSpeechRow">
            <div id="buffaloSpeechBubble">
              <span> {this.state.sass}</span>
            </div>
          </div>
          <div id="mrBuffaloHolderHolder">
            <SmokeyBuff />
          </div>
          <button id="exit" onClick={()=>{this.props.navigate('setUp')}}>X</button>
        </div>
    )
  }
}


export default Words;
