$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});


var config = {
    apiKey: "AIzaSyANfwhjv-oRcJhVp6sQfArTorgh4jsZFJw",
    authDomain: "datashore-7057d.firebaseapp.com",
    databaseURL: "https://datashore-7057d.firebaseio.com",
    projectId: "datashore-7057d",
    storageBucket: "datashore-7057d.appspot.com",
    messagingSenderId: "352958906618"
  };
firebase.initializeApp(config);


//* ############ SIGN UP FORM ############ *//
var signUpForm = document.getElementById("signup-form");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var displayNameInput = document.getElementById("display-name-input");
console.log("called");

authenticateUser();

signUpForm.addEventListener("submit", function(evt) {
    console.log("get started");
    evt.preventDefault();


    firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function(user) {
            return user.updateProfile({
                displayName: displayNameInput.value,
            });
        })
        .then(function() {
            window.location = "index.html";
        })
        .catch(function(err) {
            alert(err.message);
        });
});


function authenticateUser(){
    firebase.auth().onAuthStateChanged(function(currUser) {
        console.log("authentication called");
        if (currUser) {
            // User is signed in.
            window.location.href = "index.html";
        }
    });
}

//* ############ END OF SIGN UP FORM ############ *//


//* ############ SIGN IN FORM ############ *//
// var signUpForm = document.getElementById("signin-form");
// var emailInput = document.getElementById("email-input");
// var passwordInput = document.getElementById("password-input");

// authenticateUser();

// signUpForm.addEventListener("submit", function(evt) {
//     evt.preventDefault();

//   	if (passwordInput.value.length > 5) {
// 	    firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value)
// 	        .then(function() {
// 	            window.location = "index.html";
// 	        })
// 	        .catch(function(err) {
// 	            alert(err.message);
// 	        });
// 	    return false;
// 	}
// });

// function authenticateUser(){
//     firebase.auth().onAuthStateChanged(function(currUser) {
//         if (currUser) {
//             // User is signed in.
//             window.location.href = "index.html";
//         }
//     });
// }