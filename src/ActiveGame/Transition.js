import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Paused from './Paused.js'
import SimpleStorage from "react-simple-storage";

var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

class Transition extends React.Component {
    constructor(props){
      super(props)
      this.docRef = db.collection("games").doc(this.props.gameName)
      this.state={
        clock:5,
      }
    }


    _isMounted = false;

    counter(){
        let second = this.state.clock
        if(this._isMounted){
          this.timer=setInterval(()=>{
            if(this.state.status!=='paused'){
              second > 1 ? second -- : second = 'Go!'
                this.setState(state=>({
                  clock:second
                }))
              if(second === 'Go!'){
                db.collection("games").doc(this.props.gameName)
                .update({
                  transitioning:false
                })
              }
            }
           },1000,second)
        }
    }


    componentDidMount(){
      this._isMounted = true;
      this.counter()
      this.unsubscribe = this.docRef
      .onSnapshot(snapshot=> {
        let snap = snapshot.data()
        this.setState(state => ({
          status:snap.status
        }))
      })
    }

    componentWillUnmount(){
      this._isMounted = false;
      clearInterval(this.timer)
      this.unsubscribe();
    }

    render(){
      return (
        this.state.status!=='paused' ?
          <div key='this is the transition page'>
            <SimpleStorage parent={this}/>
            <h3>Player Up:</h3>
            <h4>{this.props.activePlayer}</h4>
            <h1> {this.state.clock} </h1>
          </div> :
          <Paused
            creator = {this.props.creator}
            gameName = {this.props.gameName}
          />
    )
  }
}

export default Transition;
