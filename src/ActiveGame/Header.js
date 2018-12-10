import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import firebase from 'firebase/app';
import 'firebase/firestore';


var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});


class Header extends React.Component {
  constructor(props){
    super(props)
    this.docRef = db.collection("games").doc(this.props.gameName)
    this.state = {
      displayClass:'hideMenu'
    }
    this.showMenu = this.showMenu.bind(this)
    this.pause = this.pause.bind(this)
    this.exit = this.exit.bind(this)
  }

  componentDidMount(){
    this.unsubscribe = this.docRef
      .onSnapshot(snap => {
          snap.data().status==='exit' && this.props.navigate('setUp')
    })
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  showMenu(){
    this.state.displayClass==='hideMenu' ?
      this.setState({
        displayClass:''
      }) :
      this.setState({
        displayClass:'hideMenu'
      })
  }

  pause(){
    this.setState({
      displayClass:'hideMenu'
    })
    db.collection("games").doc(this.props.gameName)
    .update({
      status:'paused'
    })
  }

  exit(){
    db.collection('games').doc(this.props.gameName)
    .update({
      status:'exit'
    })
  }

  render(){
    //only show the menu to the creator
    if(this.props.creator){
      return(
        <div>
          <FontAwesomeIcon icon={faBars} onClick={this.showMenu}/>
          <div className='menu'>
            <ul id="menuUL" className={this.state.displayClass}>
              <li className="menuLI" onClick={this.pause}>Pause & Rules</li>
              <li className="menuLI" onClick={this.exit}>End Game</li>
            </ul>
          </div>
        </div>
      )
    } else {
      return(<div></div>)
    }
  }
}

export default Header;
