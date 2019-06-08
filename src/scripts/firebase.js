// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC8XPV72_v-phXq6p4kY9Kec9po1b-y9cY",
    authDomain: "translations-3c0c8.firebaseapp.com",
    databaseURL: "https://translations-3c0c8.firebaseio.com",
    projectId: "translations-3c0c8",
    storageBucket: "translations-3c0c8.appspot.com",
    messagingSenderId: "613261569807",
    appId: "1:613261569807:web:bde86c3efbe782b7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var dataFromFirebase;
var mainIndex;

const databeseRef = firebase.database().ref();
databeseRef.once("value")
.then(function(snapshot) {
    dataFromFirebase = snapshot.val();
    // dataFromFirebase.sort(function(a, b){
    //     return a.percent - b.percent;
    // });
    mainIndex = dataFromFirebase.length;
    fillDOM(dataFromFirebase);
    eventListeners(dataFromFirebase);
});

// firebase.database().ref('/30/').set({
//     pl: "kot",
//     en: "cat"
// });

// updateDB(20, 10, 6, 60);