var model = (function() {

    var data = {
        database: null,
        databaseRef: null,
        dataFromFirebase: null,
        sortedDataFromFirebase: null
    };

    var firebaseConfig = {
        apiKey: "AIzaSyC8XPV72_v-phXq6p4kY9Kec9po1b-y9cY",
        authDomain: "translations-3c0c8.firebaseapp.com",
        databaseURL: "https://translations-3c0c8.firebaseio.com",
        projectId: "translations-3c0c8",
        storageBucket: "translations-3c0c8.appspot.com",
        messagingSenderId: "613261569807",
        appId: "1:613261569807:web:bde86c3efbe782b7"
    };

    var sortDataFromFirebase = function(firebaseData){
        var sortedValuesArray = Object.values(firebaseData).sort(function(a,b){
            return a.percent-b.percent;
        });
        data.sortedDataFromFirebase = sortedValuesArray;
    }

    // var addNewWord = function(inputPL, inputEN){
    //     var wordPL = inputPL.value;
    //     var wordEN = inputEN.value;
    //     if(wordPL && wordEN){
    //         updateDB(wordEN, wordPL, wordEN, 0, 0, 0);
    //         inputPL.value = '';
    //         inputEN.value = '';
    //     }
    // }

    var setupFirebaseConnection = function(){
        
    }
    
    var getDataFromFirebase = function(){

    }

    var updateDB = function(path, pl, en, attempts, success, percent){
        firebase.database().ref('/'+path+'/pl').set(pl);
        firebase.database().ref('/'+path+'/en').set(en);
        firebase.database().ref('/'+path+'/attempts').set(attempts);
        firebase.database().ref('/'+path+'/success').set(success);
        firebase.database().ref('/'+path+'/percent').set(percent);
    }

    var nodeToArray = function(nodeList){
        return Array.prototype.slice.call(nodeList);
    }

    return {
        log: function(){
            console.log(data);
        },
        setupFirebaseConnection: function(){
            firebase.initializeApp(firebaseConfig);
            data.database = firebase.database();
            data.databaseRef = firebase.database().ref();
        },
        getDataFromFirebaseServer: function(){
            return data.databaseRef.once("value");
        },
        getData: function() {
            return data;
        },
        setFirabaseData: function(value){
            data.dataFromFirebase = value;
            sortDataFromFirebase(data.dataFromFirebase);
        },
        addNewWord: function(inputPL, inputEN){
            var wordPL = inputPL.value;
            var wordEN = inputEN.value;
            if(wordPL && wordEN){
                updateDB(wordEN, wordPL, wordEN, 0, 0, 0);
                inputPL.value = '';
                inputEN.value = '';
            }
        },
        checkAnswers: function(reloadDOMFunction, dataFromFirebase){
            var rowsNodes = document.querySelectorAll('.random-table tr');
            // console.log('Data from firebase');
            // console.log(dataFromFirebase);
            var rows = nodeToArray(rowsNodes);
            if(rows.length > 0){
                rows.forEach((row, i) => {
                    var en = row.childNodes[0].textContent;
                    var attempts = dataFromFirebase[en].attempts + 1;
                    var success = dataFromFirebase[en].success;
                    var pl = row.childNodes[2].textContent;
                    var plTd = row.childNodes[2];
                    var input = row.childNodes[1].childNodes[0].value;
                    if(pl.includes(input) && input !== ''){
                        plTd.classList.add('correct');
                        success++;
                        
                    } else {
                        plTd.classList.add('wrong');
                    }
                    var percentage = Math.round(success/attempts*100*100)/100;
                    updateDB(en, pl, en, attempts, success, percentage);
                    // console.log('EN: ' + en);
                    // console.log('PL: ' + pl);
                    // console.log('attemps: ' + attempts);
                    // console.log('Success: ' + success);
                    // console.log('Percentage: ' + percentage);
                });
                reloadDOMFunction();
            } else {
                console.log('No table drawn.');
            }
        }
    };

})();

// var firebaseConfig = {
//     apiKey: "AIzaSyC8XPV72_v-phXq6p4kY9Kec9po1b-y9cY",
//     authDomain: "translations-3c0c8.firebaseapp.com",
//     databaseURL: "https://translations-3c0c8.firebaseio.com",
//     projectId: "translations-3c0c8",
//     storageBucket: "translations-3c0c8.appspot.com",
//     messagingSenderId: "613261569807",
//     appId: "1:613261569807:web:bde86c3efbe782b7"
// };

// firebase.initializeApp(firebaseConfig);