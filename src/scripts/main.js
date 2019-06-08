// var dataFromJSON;
// const filePromise = new Promise((resolve, reject)=>{
//     var xobj = new XMLHttpRequest();
//     xobj.overrideMimeType("application/json");
//     xobj.open('GET', '../translations.json', true);
//     xobj.addEventListener('load', function() {
//         if (this.status === 200) {
//             resolve(JSON.parse(xobj.responseText));
//         }
//     });
//     xobj.send(null);  
// });

// filePromise.then((resolved)=>{
//     dataFromJSON = resolved;
//     fillDOM(dataFromJSON);
//     eventListeners(dataFromJSON);
// });

// FUNCTIONS
function fillDOM(array) {
    var table = document.querySelector('.main-table');
    var lvl;
    array.forEach(element => {
        switch (true) {
            case element.attempts == 0:
                lvl = ' ';
                break;
            case element.percent>75:
                lvl = 'good';
                break;
            case element.percent>50:
                lvl = 'average';
                break;
            default:
                lvl = 'weak';
                break;
        }
        table.insertAdjacentHTML('beforeend', '<tr class="'+lvl+'"><td>'+element.en+'</td><td>'+element.percent+'%</td><td>'+element.success+'/'+element.attempts+'</td><td>'+element.pl+'</td></tr>');
    });
}

function drawRandom(quantity, array){
    var tempArray = array.slice();
    var tableRandom = document.querySelector('.random-table');
    tableRandom.innerHTML = '';
    quantity = (quantity > tempArray.length) ? tempArray.length : quantity;
    for (let index = 0; index < quantity; index++) {
        do {
            var randomIndex = Math.floor(Math.random() * (tempArray.length));
        } while (tempArray[randomIndex] == 'already selected');
        tableRandom.insertAdjacentHTML('beforeend', '<tr><td>'+randomIndex+'</td><td>'+tempArray[randomIndex].en+'</td><td><input type="text" placeholder="answear"></td><td>'+tempArray[randomIndex].pl+'</td></tr>');
        tempArray[randomIndex] = 'already selected';
    }
    document.querySelector('input.checkAnswears').addEventListener('click', function(){
        checkAnswears();
    });
}

function checkAnswears() {
    var rowsNodes = document.querySelectorAll('.random-table tr');
    var rows = nodeToArray(rowsNodes);
    rows.forEach((row, i) => {
        var index = row.childNodes[0].textContent;
        var attempts = dataFromFirebase[index].attempts + 1;
        var success = dataFromFirebase[index].success;
        var en = row.childNodes[1].textContent;
        var pl = row.childNodes[3].textContent;
        var plTd = row.childNodes[3];
        var input = row.childNodes[2].childNodes[0].value;
        if(pl.includes(input) && input !== ''){
            plTd.classList.add('correct');
            success++;
        } else {
            plTd.classList.add('wrong');
        }
        var percentage = success/attempts*100;
        updateDB(index, pl, en, attempts, success, percentage);
    });
}

function updateDB(index, pl, en, attempts, success, percent){
    firebase.database().ref('/'+index+'/pl').set(pl);
    firebase.database().ref('/'+index+'/en').set(en);
    firebase.database().ref('/'+index+'/attempts').set(attempts);
    firebase.database().ref('/'+index+'/success').set(success);
    firebase.database().ref('/'+index+'/percent').set(percent);
}

function addNewWord(){
    var inputPL = document.querySelector('.input-new-word-pl');
    var inputEN = document.querySelector('.input-new-word-en');
    var wordPL = inputPL.value;
    var wordEN = inputEN.value;
    if(wordPL && wordEN){
        updateDB(mainIndex, wordPL, wordEN, 0, 0, 0);
        mainIndex++;
        inputPL.value = '';
        inputEN.value = '';
    }
}

function eventListeners(data) {
    // draw ranodm
    document.querySelector('button.draw').addEventListener('click', function(){
        var quantity = document.querySelector('.input-quantity').value;
        if(quantity){
            drawRandom(quantity, data);
        }
    });

    // add new word
    document.querySelector('.submit-new-word').addEventListener('click', function(button){
        button.preventDefault();
        addNewWord();
    });
}

function nodeToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}
