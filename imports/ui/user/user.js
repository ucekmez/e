// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Positions} from '/imports/api/collections/positions.js'; // Positions collections

import '../landing/main_navigation.html' // MainNavigation
import './layout.html'; // UserLayout
import './dashboard_main.html'; // UserDashboard
import './left_menu.html'; // UserLeftMenu

import './forms/forms.js';
import './keynotes/keynotes.js';
import './videos/videos.js';
import './pis/pis.js';
import './positions/positions.js';


const userRoutes = FlowRouter.group({ prefix: '/user', name: 'user',
  triggersEnter: [function() {
    if (Meteor.loggingIn()) { BlazeLayout.render('LoadingLayout');}
    else {
      if (Meteor.userId() && Meteor.user()) {
        if (!Roles.userIsInRole(Meteor.userId(), ['user'])) { FlowRouter.go('home'); }
      }else { FlowRouter.go('notfound'); }
    }
  }]
});
userRoutes.route('/', { name: 'user_dashboard',
  breadcrumb: { title: "Dashboard" },
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


userRoutes.route('/position/:positionId', { name: 'user_positionapply', action() { BlazeLayout.render('UserPositionResponseApplyLayout'); } });

userRoutes.route('/application/:applicationId/S1/:formId', { name: 'user_position_applicationS1',
  action: function() { BlazeLayout.render('UserApplicationPrerequisitesLayout'); } });

userRoutes.route('/application/:applicationId/S2/:formId', { name: 'user_position_applicationS2',
  action: function() { BlazeLayout.render('UserApplicationSurveyLayout'); } });

userRoutes.route('/application/:applicationId/S3/:formId', { name: 'user_position_applicationS3',
  action: function() { BlazeLayout.render('UserApplicationTestLayout'); } });

userRoutes.route('/application/:applicationId/S4/:piId', { name: 'user_position_applicationS4',
  action: function() { BlazeLayout.render('UserApplicationPILayout'); } });

userRoutes.route('/application/:applicationId/S5/:keynoteId', { name: 'user_position_applicationS5',
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
  action: function() { BlazeLayout.render('UserApplicationKeynoteLayout'); } });

userRoutes.route('/application/:applicationId/S6/:questionId', { name: 'user_position_applicationS6',
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
  action: function() { BlazeLayout.render('UserApplicationVideoLayout'); } });


userRoutes.route('/application/:applicationId/thanks', { name: 'user_position_application_thanks',
  action: function() { BlazeLayout.render('UserApplicationThanksLayout'); } });


userRoutes.route('/appliedpositions/', { name: 'user_applied_positions',
  breadcrumb: { parent: "user_dashboard", title: "Applied Positions" },
  action() { BlazeLayout.render('UserLayout', { nav: 'MainNavigation', left: 'UserLeftMenu', main: 'UserAppliedPositions' }); } });











//////////// Template events, helpers

Template.registerHelper("fetchPositionInformation", function(position_id){
  return Positions.findOne(position_id);
});


Template.registerHelper("doesPositionExist", function(position_id){
  return Positions.findOne(position_id);
});
