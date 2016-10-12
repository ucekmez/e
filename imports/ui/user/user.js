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
  triggersEnter: [() => {
    if (Meteor.userId() && Meteor.user()) {
      if (!Roles.userIsInRole(Meteor.userId(), ['user'])) { FlowRouter.go('home'); }
    }else { FlowRouter.go('home'); }
  }],
});

userRoutes.route('/', { name: 'user_dashboard',
  breadcrumb: { title: "Dashboard" },
  action() {
    BlazeLayout.render('UserLayout', { nav: 'MainNavigation', left: 'UserLeftMenu', main: 'UserDashboard' });
    NProgress.done();
  } });

userRoutes.route('/form/:formId', { name: 'user_formresponse',
  action() { BlazeLayout.render('UserFormResponseLayout'); NProgress.done(); } });

userRoutes.route('/test/lang/:templateId', { name: 'user_langtestresponse',
  action() { BlazeLayout.render('UserLangTestResponseLayout'); NProgress.done(); } });
userRoutes.route('/test/tech/:templateId', { name: 'user_techtestresponse',
  action() { BlazeLayout.render('UserTechTestResponseLayout'); NProgress.done(); } });

userRoutes.route('/PI/:piId', { name: 'user_piresponse',
  action() { BlazeLayout.render('UserPIResponseLayout'); NProgress.done(); } });

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
  action() { BlazeLayout.render('UserKeynoteResponseLayout'); NProgress.done(); } });

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
  action: function() { BlazeLayout.render('UserVideoResponseLayout'); NProgress.done(); } });


userRoutes.route('/position/:positionId', { name: 'user_positionapply', action() { BlazeLayout.render('UserPositionResponseApplyLayout'); } });

userRoutes.route('/application/:applicationId/S1/:formId', { name: 'user_position_applicationS1',
  action: function() { BlazeLayout.render('UserApplicationPrerequisitesLayout'); NProgress.done(); } });

userRoutes.route('/application/:applicationId/S2/:formId', { name: 'user_position_applicationS2',
  action: function() { BlazeLayout.render('UserApplicationSurveyLayout'); NProgress.done(); } });

userRoutes.route('/application/:applicationId/S3/:formId', { name: 'user_position_applicationS3',
  action: function() { BlazeLayout.render('UserApplicationTestLayout'); NProgress.done(); } });

userRoutes.route('/application/:applicationId/S4/:piId', { name: 'user_position_applicationS4',
  action: function() { BlazeLayout.render('UserApplicationPILayout'); NProgress.done(); } });

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
  action: function() { BlazeLayout.render('UserApplicationKeynoteLayout'); NProgress.done(); } });

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
  action: function() { BlazeLayout.render('UserApplicationVideoLayout'); NProgress.done(); } });


userRoutes.route('/application/:applicationId/thanks', { name: 'user_position_application_thanks',
  action: function() { BlazeLayout.render('UserApplicationThanksLayout'); NProgress.done(); } });


userRoutes.route('/appliedpositions/', { name: 'user_applied_positions',
  breadcrumb: { parent: "user_dashboard", title: "Applied Positions" },
  action() {
    BlazeLayout.render('UserLayout', { nav: 'MainNavigation', left: 'UserLeftMenu', main: 'UserAppliedPositions' });
    NProgress.done();
  } });













//////////// Template events, helpers

Template.UserLeftMenu.events({
  'click #user-apply-for-a-position'(event, instance) {
    $('.modal.user-apply-for-a-position')
      .modal({
        //blurring: true,
        onShow() {},
        onHidden() {},
        onApprove() {
          console.log("ok")
          const position_short_id = $('#apply-for-a-position-input').val();
          const position = Positions.findOne({ shortid: position_short_id});
          if(position) {
            FlowRouter.go('user_positionapply', { positionId: position._id });
          }else {
            toastr.warning("There is no such active position! Please rewise your search.");
          }
        },
        onDeny() {}
      })
      .modal('show');
  },
});


Template.registerHelper("fetchPositionInformation", function(position_id){
  return Positions.findOne(position_id);
});


Template.registerHelper("doesPositionExist", function(position_id){
  return Positions.findOne(position_id);
});
