var loginForm = (function() {

    var loginButton = document.querySelector('.submit-login');
    var loginForm = document.querySelector('.login-form-wrapper');
    var logoutButton = document.querySelector('.logout-btn');

    var handleSubmitButton = function() { 
        loginButton.addEventListener('click', function(e){
            e.preventDefault();
            // TO DO
            // get login data forom inputs
            firebase.auth().signInWithEmailAndPassword('lukaszmodelski90@gmail.com', 'HEREPASSWORD')
                .then(function(val) {
                    controller.init();
                    loginForm.classList.add('display-none');
                    view.showMainContent();
                    // TO DO
                    // show notification about succesfull login
                })
                .catch(function(error) {
                    console.log(error.code);
                    console.log(error.message);
                    // TO DO
                    // show notification about unsuccesfull login
                });
        });
    }

    var handleLogout = function() {
        logoutButton.addEventListener('click', function(e){
            e.preventDefault();
            firebase.auth().signOut()
                .then(function() {
                    console.log('Signed out succesfully');
                    loginForm.classList.remove('display-none');
                    view.clearMainTable();
                    view.clearRandomTable();
                    view.hideMainContent();
                    // TO DO
                    // disable drawing random and adding new word
                })
                .catch(function(error) {
                    console.log(error);
                });
        });
    }

    return {
        init: function() {
            handleSubmitButton();
            handleLogout();
            model.setupFirebaseConnection();
        }
    }
})();

loginForm.init();
