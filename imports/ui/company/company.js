// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Companies } from '/imports/api/collections/companies.js';
import { Slides, Keynotes } from '/imports/api/collections/keynotes.js'; // Keynotes collections
import { Positions } from '/imports/api/collections/positions.js'; // Positions collections
import { InterviewQuestions } from '/imports/api/collections/videos.js'; // Videos collections
import { Forms } from '/imports/api/collections/forms.js'; // Forms collections
import { PIGroups } from '/imports/api/collections/pis.js'; // PIs collections

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../landing/main_navigation.html' // MainNavigation
import '../landing/loading.html' // LoadingLayout

import './layout.html'; // CompanyLayout
import './dashboard_main.html'; // CompanyDashboard
import './left_menu.html'; // CompanyLeftMenu

// ******************** //

import './forms/forms.js';
import './keynotes/keynotes.js';
import './positions/positions.js';
import './positions/process/process.js';
import './videos/videos.js';
import './pis/pis.js';

import './generic_events.js';

// ******************** //


const companyRoutes = FlowRouter.group({ prefix: '/company', name: 'company',
  triggersEnter: [function() {
    if (Meteor.loggingIn()) { BlazeLayout.render('LoadingLayout');}
    else {
      if (Meteor.userId() && Meteor.user()) {
        if (!Roles.userIsInRole(Meteor.userId(), ['company'])) {
          FlowRouter.go('notfound');
        }
      }else {
        FlowRouter.go('notfound');
      }
    }
  }]
});
companyRoutes.route('/', { name: 'company_dashboard',
  breadcrumb: {
    title: "Dashboard"
  },
  action() { BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyDashboard' }); } });


//************ forms routes

const companyFormRoutes = companyRoutes.group({ prefix: "/forms", name: "companyforms"});
companyFormRoutes.route('/edit/:formId', { name: 'edit_form',
  breadcrumb: {
    parent: "list_forms",
    title: "Edit Form"
  },
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('getformpreview', Meteor.subscribe("getFormForPreview", params._id));
    }
  },
  action: function(params) {
    BlazeLayout.render('CompanyEditFormLayout', { nav: 'MainNavigation', main: 'CompanyEditForm' }); } });
companyFormRoutes.route('/preview/fill/:formId', { name: 'preview_form',
  action: function(params) { BlazeLayout.render('CompanyPreviewForm'); } });
companyFormRoutes.route('/preview/response/:formId', { name: 'preview_form_response',
  action: function(params) { BlazeLayout.render('CompanyPreviewFormResponse'); } });
companyFormRoutes.route('/list', { name: 'list_forms',
  breadcrumb: {
    parent: "company_dashboard",
    title: "List Forms"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListForms' }); } });

companyFormRoutes.route('/list/responses/:formId', { name: 'list_form_responses',
  triggersEnter: [function() { Session.set("coming_from", "single_forms"); }],
  breadcrumb: {
    parent: "list_forms",
    title: "List Responses"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListApplicantFormResponses' }); } });

companyFormRoutes.route('/response/:responseId/', { name: 'preview_applicant_form_response',
  triggersExit: [function() { Session.set("coming_from", null); }],
  action: function(params) { BlazeLayout.render('CompanyPreviewApplicantFormResponse'); } });

// preview pre-defined tests
companyFormRoutes.route('/preview/lang/:templateId', { name: 'preview_lang_test',
  action: function(params) { BlazeLayout.render('CompanyPreviewLanguageTest'); } });
companyFormRoutes.route('/preview/tech/:templateId', { name: 'preview_tech_test',
  action: function(params) { BlazeLayout.render('CompanyPreviewTechnicalTest'); } });

companyFormRoutes.route('/response/lang/:responseId', { name: 'preview_lang_test_response',
  action: function(params) { BlazeLayout.render('CompanyLanguageTestResponse'); } });
companyFormRoutes.route('/response/tech/:responseId', { name: 'preview_tech_test_response',
  action: function(params) { BlazeLayout.render('CompanyTechnicalTestResponse'); } });

companyFormRoutes.route('/list/lang/responses/:templateId', { name: 'list_lang_test_responses',
  triggersEnter: [function() { Session.set("coming_from", "single_forms"); }],
  breadcrumb: {
    parent: "list_forms",
    title: "List Responses"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListLangApplicantFormResponses' }); } });

companyFormRoutes.route('/list/tech/responses/:templateId', { name: 'list_tech_test_responses',
  triggersEnter: [function() { Session.set("coming_from", "single_forms"); }],
  breadcrumb: {
    parent: "list_forms",
    title: "List Responses"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListTechApplicantFormResponses' }); } });

companyFormRoutes.route('/user/response/lang/:responseId/', { name: 'preview_applicant_langtest_response',
  triggersExit: [function() { Session.set("coming_from", null); }],
  action: function(params) { BlazeLayout.render('CompanyPreviewApplicantLangTestResponse'); } });

companyFormRoutes.route('/user/response/tech/:responseId/', { name: 'preview_applicant_techtest_response',
  triggersExit: [function() { Session.set("coming_from", null); }],
  action: function(params) { BlazeLayout.render('CompanyPreviewApplicantTechTestResponse'); } });

///// pis routes

const companyPIsRoutes = companyRoutes.group({ prefix: "/PIs", name: "companypis"});
companyPIsRoutes.route('/new', { name: 'create_new_pi',
  breadcrumb: {
    parent: "company_dashboard",
    title: "Create New PI"
  },
  action: function(params) {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyAddNewPICombination' }); } });

companyPIsRoutes.route('/list', { name: 'list_combinations',
  breadcrumb: {
    parent: "company_dashboard",
    title: "List Combinations"
  },
  action: function(params) {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListPICombinations' }); } });

companyPIsRoutes.route('/preview/fill/:piId', { name: 'preview_pi',
  action: function(params) { BlazeLayout.render('CompanyPreviewPI'); } });

companyPIsRoutes.route('/preview/response/:piId', { name: 'preview_pi_response',
  action: function(params) { BlazeLayout.render('CompanyPreviewPIResponse'); } });

companyPIsRoutes.route('/list/responses/:piId', { name: 'list_pi_responses',
  triggersEnter: [function() { Session.set("coming_from", "single_pis"); }],
  breadcrumb: {
    parent: "list_combinations",
    title: "List Responses"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListApplicantPIResponses' }); } });

companyPIsRoutes.route('/response/:responseId/', { name: 'preview_applicant_pi_response',
  action: function(params) { BlazeLayout.render('CompanyPreviewApplicantPIResponse'); } });



//************ keynotes routes

const companyKeynoteRoutes = companyRoutes.group({ prefix: "/keynotes", name: "companykeynotes"});
companyKeynoteRoutes.route('/edit/:keynoteId', { name: 'edit_keynote',
  breadcrumb: {
    parent: "list_keynotes",
    title: "Edit Keynote"
  },
  action: function(params) {
    BlazeLayout.render('CompanyEditKeynoteLayout', { nav: 'MainNavigation', main: 'CompanyEditKeynote' }); } });
companyKeynoteRoutes.route('/list', { name: 'list_keynotes',
  breadcrumb: {
    parent: "company_dashboard",
    title: "List Keynotes"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListKeynotes' }); } });
companyKeynoteRoutes.route('/preview/:keynoteId', { name: 'preview_keynote',
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
  action: function() {
    BlazeLayout.render('CompanyKeynotePreviewLayout'); } });

companyKeynoteRoutes.route('/list/responses/:keynoteId', { name: 'list_keynote_responses',
  breadcrumb: {
    parent: "list_keynotes",
    title: "List Responses"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListApplicantKeynoteResponses' }); } });



//************ positions routes

const companyPositions = companyRoutes.group({ prefix: "/positions", name: "companypositions"});
companyPositions.route('/list', { name: 'list_positions',
  breadcrumb: {
    parent: "company_dashboard",
    title: "List Positions"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListPositions' }); } });
companyPositions.route('/edit/:positionId', { name: 'edit_position',
  breadcrumb: {
    parent: "list_positions",
    title: "Edit Position"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyEditPosition' }); } });

companyPositions.route('/process/s1/:positionId', { name: 'extend_recruitment_positionS1',
  breadcrumb: { parent: "list_positions", title: "Extend Recruitment Process" },
  action: function() { BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyExtendRecruitmentProcessS1' }); } });

companyPositions.route('/process/s2/:positionId', { name: 'extend_recruitment_positionS2',
  breadcrumb: { parent: "list_positions", title: "Extend Recruitment Process" },
  action: function() { BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyExtendRecruitmentProcessS2' }); } });

companyPositions.route('/process/s3/:positionId', { name: 'extend_recruitment_positionS3',
  breadcrumb: { parent: "list_positions", title: "Extend Recruitment Process" },
  action: function() { BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyExtendRecruitmentProcessS3' }); } });

companyPositions.route('/process/s4/:positionId', { name: 'extend_recruitment_positionS4',
  breadcrumb: { parent: "list_positions", title: "Extend Recruitment Process" },
  action: function() { BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyExtendRecruitmentProcessS4' }); } });

companyPositions.route('/process/s5/:positionId', { name: 'extend_recruitment_positionS5',
  breadcrumb: { parent: "list_positions", title: "Extend Recruitment Process" },
  action: function() { BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyExtendRecruitmentProcessS5' }); } });

companyPositions.route('/process/s6/:positionId', { name: 'extend_recruitment_positionS6',
  breadcrumb: { parent: "list_positions", title: "Extend Recruitment Process" },
  action: function() { BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyExtendRecruitmentProcessS6' }); } });


companyPositions.route('/list/responses/:positionId', { name: 'list_position_responses',
  breadcrumb: { parent: "list_positions", title: "List Responses" },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListApplicantPositionResponses' }); } });

companyPositions.route('/list/responses/single/:applicationId', { name: 'single_applicant_position_responses',
  triggersEnter: [function(params) { Session.set("coming_from", "positionresponse");}],
  breadcrumb: { parent: "list_positions", title: "Applicant Response" },
  action: function(params, queryParams) {
    Session.set("current_application_id", params.applicationId);
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListSingleApplicantPositionResponses' }); } });








//************ interview questions routes

const companyQuestions = companyRoutes.group({ prefix: "/questions", name: "companyquestions"});
companyQuestions.route('/list', { name: 'list_questions',
  breadcrumb: {
    parent: "company_dashboard",
    title: "List Questions"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListQuestions' }); } });
companyQuestions.route('/edit/:questionId', { name: 'edit_question',
  breadcrumb: {
    parent: "list_questions",
    title: "Edit Question"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyEditQuestion' }); } });
companyQuestions.route('/preview/record/:questionId', { name: 'preview_record_question',
  breadcrumb: {
    parent: "list_questions",
    title: "Record Sample"
  },
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
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyPreviewRecordQuestion' }); } });
companyQuestions.route('/preview/answer/:questionId', { name: 'preview_answer_question',
  breadcrumb: {
    parent: "list_questions",
    title: "Preview Sample"
  },
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('showquestion', Meteor.subscribe("getInterviewQuestion", params._id));
      this.register('showquestionvideo', Meteor.subscribe("getInterviewQuestionVideo", params._id));
    }
  },
  triggersExit: [function() {
    if (typeof(a_player) !== "undefined") {
      a_player.dispose();
    }
  }],
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyPreviewAnswerQuestion' }); } });


companyQuestions.route('/list/responses/:questionId', { name: 'list_video_responses',
  triggersEnter: [function() { Session.set("coming_from", "single_videos"); }],
  breadcrumb: {
    parent: "list_questions",
    title: "List Responses"
  },
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListApplicantVideoResponses' }); } });


companyQuestions.route('/response/:responseId', { name: 'preview_video_response',
  breadcrumb: {
    parent: "list_questions",
    title: "Preview Response"
  },
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('showquestion', Meteor.subscribe("getInterviewQuestion", params._id));
      this.register('showquestionvideo', Meteor.subscribe("getInterviewQuestionVideo", params._id));
    }
  },
  triggersExit: [function() {
    if (typeof(a_player) !== "undefined") {
      a_player.dispose();
    }
  }],
  action: function() {
    BlazeLayout.render('CompanyPreviewApplicantVideoResponse'); } });


//////////// Template events, helpers


Template.CompanyLeftMenu.events({
  'click #add-new-form'(event, instance) {
    f_add_new_form(event, instance);
  },
  'click #add-new-test'(event, instance) {
    f_add_new_test(event, instance);
  },
  'click #add-new-prerequisite'(event, instance) {
    f_add_new_prerequisite(event, instance);
  },

  'click #add-new-keynote'(event, instance) {
    f_add_new_keynote(event, instance);
  },

  'click #add-new-position'(event, instance) {
    if($('.modal.add-new-position').length > 1) {
      $('.modal.add-new-position')[1].remove();
    }
    f_add_new_position(event, instance);
  },

  'click #add-new-question'(event, instance) {
    if($('.modal.add-new-question').length > 1) {
      $('.modal.add-new-question')[1].remove();
    }
    f_add_new_question(event, instance);
  },
});



Template.CompanyDashboard.helpers({
  company() {
    return Companies.findOne({ user: Meteor.userId()});
  },
  saved_positions() {
    return Positions.find({ user: Meteor.userId() }).count();
  },
  saved_combinations() {
    return PIGroups.find({ user: Meteor.userId() }).count();
  },
  saved_forms() {
    return Forms.find({ user: Meteor.userId() }).count();
  },
  saved_keynotes() {
    return Keynotes.find({ user: Meteor.userId() }).count();
  },
  saved_questions() {
    return InterviewQuestions.find({ user: Meteor.userId() }).count();
  },


});



////////////// registerhelper functions

Template.registerHelper("scaleText", function(content){
  if (content) {
    let c = content.replace(new RegExp("[1][0-9]px","gm"), "6px");
    c = c.replace(new RegExp("[2][0-9]px","gm"), "9px");
    c = c.replace(new RegExp("[3-9][0-9]px","gm"), "12px");
    c = c.replace(new RegExp("<br>","gm"), "");
    c = c.replace(new RegExp("<p></p>","gm"), "");
    return c;
  }
});


setInterval(function() { Session.set("time", new Date()); }, 60000);
Template.registerHelper("dateFromNow", function(date){
  Session.get('time');
  return moment(date).fromNow();
});

Template.registerHelper("convertToDateFormat", function(date) {
  var day = date.getDate();
  if (day < 10) { day = "0" + day }

  var month = date.getMonth() + 1;
  if (month < 10) { month = "0" + month }

  return date.getFullYear() + "-" + month + "-" + day;
});


Template.registerHelper("ifEqualSelect", function(v1, v2) {
  if (v1 === v2) return "selected";
});
