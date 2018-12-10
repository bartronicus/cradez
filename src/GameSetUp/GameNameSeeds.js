import firebase from 'firebase/app';
import 'firebase/firestore';


firebase.initializeApp({
  apiKey:  "AIzaSyCFQ8eW1UYsofV4woY2mkuil1KKmS7fH-A",
  authDomain: "charades-221618.firebaseapp.com",
  projectId: "charades-221618"
});



const nouns = ['wizard','alien','hippy','brandon','bologna','moose','mouse','batman','penguin','dino','dragon','monkey','nug','slacks','jeans','pajamas','cheese','booty','chips','lemur','tater','spud','elf','dwarf','hancho','beard','muppet','koala','sandwich','socks','mattress','monster','ghost','slippers','lemur','gorilla']
const actions = ['sweaty','slippery','smelly','arrogant','musky','dank','atomic','cosmic','tasty','creamy','salty','crunchy','crusty','skunky','cranky','funky','fluffy','husky','dreamy','gassy','mossy','furry','stinky','droopy','sticky','grouchy','squeaky','bearded','buff','macho','spooky','spoiled','toasty','chunky','roasted','toasted','juicy','buttered','buttery','toasty','moldy','sketchy','crispy','toned','bloated','spicy','moist']


const lists = {
  nouns:nouns,
  actions:actions
}

export default lists;
