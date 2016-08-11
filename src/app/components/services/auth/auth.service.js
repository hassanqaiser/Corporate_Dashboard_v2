(function () {
  'use strict';

angular
  .module('p4')
  .service("Auth", function (firebaseKeysConstant) {

    this.currentLoggedInUserId = null;
    var config = {
      apiKey: firebaseKeysConstant.firebaseApiKey,
      authDomain: firebaseKeysConstant.firebaseAuthDomain,
      databaseURL: firebaseKeysConstant.firebaseDatabaseURL,
      storageBucket: firebaseKeysConstant.firebaseStorageBucket,
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if(user.isAnonymous){
          $(".currentUserEmail").html('Anonymous');
        } else {
          $(".currentUserEmail").html(user.email);
        }
        console.log(user, "in observable");
        this.currentLoggedInUserId = user.uid;
        //$state.go('home');
      } else {
        // if ($state.current.url !== "/signin") {
        //   $state.go('signin');
        // }
        console.error("No user signed in");
      }
    });

    this.createAccount = function(email, password) {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error({ ErrorCode: errorCode, ErrorMessage: errorMessage });
      });
    }

    this.login = function(email, password) {
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error({ ErrorCode: errorCode, ErrorMessage: errorMessage });
      });
    }

    this.loginUsingGmail = function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      firebase.auth().signInWithRedirect(provider);
      firebase.auth().getRedirectResult().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error({ ErrorCode: errorCode, ErrorMessage: errorMessage });
      });
    }

    this.loginUsingFacebook = function() {
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('user_birthday');
      firebase.auth().signInWithRedirect(provider);
      firebase.auth().getRedirectResult().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error({ ErrorCode: errorCode, ErrorMessage: errorMessage });
      });
    }

    this.loginUsingGithub = function() {
      var provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('repo');
      firebase.auth().signInWithRedirect(provider);
      firebase.auth().getRedirectResult().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error({ ErrorCode: errorCode, ErrorMessage: errorMessage });
      });
    }

    this.loginUsingTwitter = function() {
      var provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithRedirect(provider);
      firebase.auth().getRedirectResult().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error({ ErrorCode: errorCode, ErrorMessage: errorMessage });
      });
    }

    this.loginAnonymously = function() {
      firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error({ ErrorCode: errorCode, ErrorMessage: errorMessage });
      });
    }

    this.logout = function() {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error({ ErrorCode: errorCode, ErrorMessage: errorMessage });
      });
    }

    this.deleteUser = function(email, password){
      firebase.removeUser({
        email    : email,
        password : password
      }, function(error) {
        if (error === null) {
          console.log("User removed successfully");
        } else {
          console.log("Error removing user:", error);
        }
      });
    }

  });


})();
