// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './landing.html'; // LandingLayout
import './not_found.html'; // NotFoundLayout
import './main_navigation.html' // MainNavigation
import './loading.html' // LoadingLayout

Template.LandingLayout.events({
  'click .sign-in'(event, instance) {
    $('.modal.sign-in-modal').modal('show');
  },
});

Template.NotFoundLayout.events({
  'click .go-home'(event, instance) {
    FlowRouter.go('home');
  },
});

Template.MainNavigation.events({
  'click #logout'(event, instance) {
    Meteor.logout(function() {
      toastr.info('You have signed out!');
      FlowRouter.go('home');
    });
  }
});
