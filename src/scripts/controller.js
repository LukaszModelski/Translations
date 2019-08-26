var controller = (function(model, view) {

    var setupFirebaseConnection = function(){

    }
    
    var getDataFromFirebase = function(){

    }

    var setupEventListeners = function(){

        var DOMElements = view.getDOMElements();
        
        // add new word
        DOMElements.addNewWord.addEventListener('click', function(){
            model.addNewWord(DOMElements.inputWordPL, DOMElements.inputWordEN);
            reloadDOM();
        });

        // draw random
        DOMElements.drawRandom.addEventListener('click', function(){
            var quantity = DOMElements.inputQuantity.value;
            var data = model.getData();
            view.drawRandomTable(quantity, data.sortedDataFromFirebase);
            // DOMElements.checkAnswears.addEventListener('click', model.checkAnswears);
        });

        // check answer
        DOMElements.checkAnswears.addEventListener('click', function(){
            var data = model.getData();
            model.checkAnswers(reloadDOM, data.dataFromFirebase);
        });

        // show hint
        // DOMElements.wordsTable.addEventListener('mouseenter', function(e) {
        //     console.log(e.target);
        // });
    };

    var reloadDOM = function(){
        model.getDataFromFirebaseServer().then(function(snapshot){
            model.setFirabaseData(snapshot.val());
            var data = model.getData();
            view.drawMainTable(data.sortedDataFromFirebase);
        });
    }

    return {
        init: function() {
            model.setupFirebaseConnection();
            reloadDOM();
            setupEventListeners();
        }
    };

})(model, view);

controller.init();