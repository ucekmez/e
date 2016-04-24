// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../landing/main_navigation.html' // MainNavigation
import './layout.html'; // UserLayout
import './dashboard_main.html'; // UserDashboard
import './left_menu.html'; // UserLeftMenu

import './forms/forms.js';
import './keynotes/keynotes.js';
import './videos/videos.js';
import './pis/pis.js';


const userRoutes = FlowRouter.group({ prefix: '/user', name: 'user',
  triggersEnter: [function() {
    if (Meteor.loggingIn()) { BlazeLayout.render('LoadingLayout');}
    else {
      if (Meteor.userId() && Meteor.user()) {
        if (!Roles.userIsInRole(Meteor.userId(), ['user'])) {
          FlowRouter.go('notfound');
        }
      }else {
        FlowRouter.go('notfound');
      }
    }
  }]
});
userRoutes.route('/', { name: 'user_dashboard',
  breadcrumb: {
    title: "Dashboard"
  },
  action() { BlazeLayout.render('UserLayout', { nav: 'MainNavigation', left: 'UserLeftMenu', main: 'UserDashboard' }); } });

userRoutes.route('/form/:formId', { name: 'user_formresponse',
  action() { BlazeLayout.render('UserFormResponseLayout'); } });

userRoutes.route('/PI/:piId', { name: 'user_piresponse',
  action() { BlazeLayout.render('UserPIResponseLayout'); } });

userRoutes.route('/keynote/:keynoteId', { name: 'user_keynoteresponse',
  triggersExit: [function() {
    $('body').removeClass('ofhiddenforslide');
    $('html').removeClass('ofhiddenforslide');
    if (typeof Reveal !== 'undefined') { Reveal.removeEventListeners(); }
  }],
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('showslides', Meteor.subscribe("getSlidesOfKeynote", params._id));
    }
  },
  action() { BlazeLayout.render('UserKeynoteResponseLayout'); } });

userRoutes.route('/record/:questionId', { name: 'user_videoresponse',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('showquestion', Meteor.subscribe("getInterviewQuestion", params._id));
      this.register('showquestionvideo', Meteor.subscribe("getInterviewQuestionVideo", params._id));
    }
  },
  triggersExit: [function() {
    if (typeof(q_player) !== "undefined") {
      q_player.recorder.destroy();
    }
  }],
  action: function() {
    BlazeLayout.render('UserVideoResponseLayout'); } });





//////////// Template events, helpers
