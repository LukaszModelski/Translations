var view = (function() {

    var DOMElementes = {
        addNewWord: document.querySelector('.submit-new-word'),
        inputWordEN: document.querySelector('.input-new-word-en'),
        inputWordPL: document.querySelector('.input-new-word-pl'),
        drawRandom: document.querySelector('button.draw'),
        randomTable: document.querySelector('.random-table'),
        inputQuantity: document.querySelector('.input-quantity'),
        checkAnswears: document.querySelector('input.checkAnswears'),
        wordsTable: document.querySelector('.main-table')
    }

    return {
        getDOMElements: function(){
            return DOMElementes;
        },
        sortDataFromFirebase: function(firebaseObject){

        },
        setUpHints: function() {
            // var showHintButtons = document.querySelectorAll('.main-table .hint');
            // showHintButtons.forEach.addEventListener('mouseenter', function(btn) {
            //     console.log(btn.target);
            // });
        },
        drawMainTable: function(firebaseData, table){
            DOMElementes.wordsTable.innerHTML = "";
            var sortedValuesArray = Object.values(firebaseData).sort(function(a,b){
                return a.percent-b.percent;
            });
            var lvl;
            sortedValuesArray.forEach(element => {
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
                DOMElementes.wordsTable.insertAdjacentHTML('beforeend', '<tr class="'+lvl+'"><td class="hint">HINT</td><td class="show-hint">?</td><td>'+element.en+'</td><td>'+element.percent+'%</td><td>'+element.success+'/'+element.attempts+'</td><td>'+element.pl+'</td></tr>');
                this.setUpHints();
            });
        },
        drawRandomTable: function(quantity, array){
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
            // var buttonCheckAnswears = document.querySelector('input.checkAnswears');
            // buttonCheckAnswears.removeEventListener('click', checkAnswears);
            // buttonCheckAnswears.addEventListener('click', checkAnswears);
        }
    };

})();