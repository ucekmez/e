import { Session } from 'meteor/session';

import '../ui/landing/loading.html';

// loading mesajlari
var message = '<p class="loading-message">Loading</p>';
var spinner = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
Template.LoadingLayout.rendered = function () {
  if ( ! Session.get('loadingSplash') ) {
    this.loading = window.pleaseWait({
      logo: '/img/fililabs_logo.png',
      backgroundColor: '#7f8c8d',
      loadingHtml: message + spinner
    });
    Session.set('loadingSplash', true); // just show loading splash once
  }
};

Template.LoadingLayout.destroyed = function () {
  if ( this.loading ) {
    this.loading.finish();
  }
};

// User accounts - sign in ve sign up sayfalari icin ayarlar
var onSubmitHookHelper = function(error, state){
  if (!error) {
   if (state === "signIn") {
     toastr.info('You have successfully logged in!');
     $('.modal.sign-in-modal').modal('hide');
     FlowRouter.go('home');
   }
   if (state === "signUp") {
     toastr.info('You have successfully signed up!');
     $('.modal.sign-in-modal').modal('hide');
     FlowRouter.go('home');
   }
 }
};

var onLogoutHookHelper = function(){
  toastr.warning('You have been logged out!');
  FlowRouter.go('home');
};


AccountsTemplates.configure({
  homeRoutePath: '/',
  onSubmitHook: onSubmitHookHelper,
  onLogoutHook: onLogoutHookHelper,
});
/*
AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/home',
    redirectTimeout: 4000,

    // Hooks
    onLogoutHook: myLogoutFunc,
    onSubmitHook: mySubmitFunc,
    preSignUpHook: myPreSubmitFunc,
    postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});
*/


// toast mesajlari gostermek icin ayarlar (toastr)
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "200",
  "hideDuration": "800",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
