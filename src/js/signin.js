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


//* ############ SIGN UP FORM ############ *//
var signUpForm = document.getElementById("signup-form");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var displayNameInput = document.getElementById("display-name-input");

authenticateUser();

$("#signup_submit").on("click",function(){
   signup();
})

// signUpForm.addEventListener("submit", function() {
function signup(){
    console.log("get started",emailInput.val);


    firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function(user) {
            return user.updateProfile({
                displayName: displayNameInput.value,
            });
        })
        .then(function() {
            window.location.href = "index.html";
        })
        .catch(function(err) {
            alert(err.message);
        });
}


function authenticateUser(){
    firebase.auth().onAuthStateChanged(function(currUser) {
        console.log("authentication called");
        if (currUser) {
            // User is signed in.
            window.location = "index.html";
        }
    });
}
//* ############ END OF SIGN UP FORM ############ *//


//* ############ SIGN IN FORM ############ *//
var signInForm = document.getElementById("signin-form");
var in_emailInput = document.getElementById("in_email-input");
var in_passwordInput = document.getElementById("in_password-input");

$("#signin_submit").on("click",function(){
    console.log("get started",in_emailInput.val);
    signin();
})

function signin(){
    console.log("get started",in_emailInput.val);
    firebase.auth().signInWithEmailAndPassword(in_emailInput.value, in_passwordInput.value)
        .then(function() {
            window.location = "index.html";
        })
        .catch(function(err) {
            alert(err.message);
        });
}
//* ############ END OF SIGN IN FORM ############ *//

//* ############ START OF PRODUCT INTRO ############ *//
$("#role").click(function(){
    console.log($("#role").prop("id"));
    $("#support_img_src").prop("src","src/img/Landing Page Image 1.png");
})
$("#problem").click(function(){
    console.log($("#problem").prop("id"));
    $("#support_img_src").prop("src","src/img/Landing Page Image 2.png");
})
$("#solution").click(function(){
    console.log($("#solution").prop("id"));
    $("#support_img_src").prop("src","src/img/Landing Page Image 3.png");
})



