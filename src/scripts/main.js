// FUNCTIONS
function fillDOM(array) {
    // console.log('FILLING DOOM');
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

function clearDOM(){
    var table = document.querySelector('.main-table');
    table.innerHTML = '';
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
        tableRandom.insertAdjacentHTML('beforeend', '<tr><td>'+tempArray[randomIndex].en+'</td><td><input type="text" placeholder="answear"></td><td>'+tempArray[randomIndex].pl+'</td></tr>');
        tempArray[randomIndex] = 'already selected';
    }
    // console.log(tempArray);
    var buttonCheckAnswears = document.querySelector('input.checkAnswears');
    buttonCheckAnswears.removeEventListener('click', checkAnswears);
    buttonCheckAnswears.addEventListener('click', checkAnswears);
}

function checkAnswears() {
    var rowsNodes = document.querySelectorAll('.random-table tr');
    var rows = nodeToArray(rowsNodes);
    rows.forEach((row, i) => {
        // var index = row.childNodes[0].textContent;
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
    reload();
}

function updateDB(path, pl, en, attempts, success, percent){
    firebase.database().ref('/'+path+'/pl').set(pl);
    firebase.database().ref('/'+path+'/en').set(en);
    firebase.database().ref('/'+path+'/attempts').set(attempts);
    firebase.database().ref('/'+path+'/success').set(success);
    firebase.database().ref('/'+path+'/percent').set(percent);
}

function reload(){
    clearDOM();
    init();
}

function addNewWord(){
    var inputPL = document.querySelector('.input-new-word-pl');
    var inputEN = document.querySelector('.input-new-word-en');
    var wordPL = inputPL.value;
    var wordEN = inputEN.value;
    if(wordPL && wordEN){
        updateDB(wordEN, wordPL, wordEN, 0, 0, 0);
        inputPL.value = '';
        inputEN.value = '';
    }
    reload();
}

function eventListeners(data) {
    // draw random
    function checkQuantityAndDraw() {
        var quantity = document.querySelector('.input-quantity').value;
        if(quantity){
            drawRandom(quantity, data);
        }
    }
    var drawButton = document.querySelector('button.draw');
    // drawButton 
    // drawButton.removeEventListener('click', checkQuantityAndDraw);
    drawButton.addEventListener('click', checkQuantityAndDraw);

    // add new word
    var preventDefaultAndAddNewWord = function(event){
        event.preventDefault();
        addNewWord();
    }
    var addNewButton = document.querySelector('.submit-new-word');
    // addNewButton.removeEventListener('click', preventDefaultAndAddNewWord);
    addNewButton.addEventListener('click', preventDefaultAndAddNewWord);
}

function nodeToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}
