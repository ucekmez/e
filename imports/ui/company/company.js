// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Companies } from '/imports/api/collections/companies.js';
import { Slides, Keynotes } from '/imports/api/collections/keynotes.js'; // Keynotes collections
import { Positions } from '/imports/api/collections/positions.js'; // Positions collections
import { InterviewQuestions } from '/imports/api/collections/videos.js'; // Videos collections
import { Forms } from '/imports/api/collections/forms.js'; // Forms collections

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
import './videos/videos.js';

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
  action() { BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyDashboard' }); } });


//************ forms routes

const companyFormRoutes = companyRoutes.group({ prefix: "/forms", name: "companyforms"});
companyFormRoutes.route('/edit/:formId', { name: 'edit_form',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('getformpreview', Meteor.subscribe("getFormForPreview", params._id));
    }
  },
  action: function(params) {
    BlazeLayout.render('CompanyEditFormLayout', { nav: 'MainNavigation', main: 'CompanyEditForm' }); } });
companyFormRoutes.route('/preview/:formId', { name: 'preview_form',
  action: function(params) { BlazeLayout.render('CompanyPreviewForm'); } });
companyFormRoutes.route('/list', { name: 'list_forms',
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListForms' }); } });


//************ keynotes routes

const companyKeynoteRoutes = companyRoutes.group({ prefix: "/keynotes", name: "companykeynotes"});
companyKeynoteRoutes.route('/edit/:keynoteId', { name: 'edit_keynote',
  action: function(params) {
    BlazeLayout.render('CompanyEditKeynoteLayout', { nav: 'MainNavigation', main: 'CompanyEditKeynote' }); } });
companyKeynoteRoutes.route('/list', { name: 'list_keynotes',
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


//************ positions routes

const companyPositions = companyRoutes.group({ prefix: "/positions", name: "companypositions"});
companyPositions.route('/list', { name: 'list_positions',
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListPositions' }); } });
companyPositions.route('/edit/:positionId', { name: 'edit_position',
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyEditPosition' }); } });


//************ interview questions routes

const companyQuestions = companyRoutes.group({ prefix: "/questions", name: "companyquestions"});
companyQuestions.route('/list', { name: 'list_questions',
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyListQuestions' }); } });
companyQuestions.route('/edit/:questionId', { name: 'edit_question',
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyEditQuestion' }); } });
companyQuestions.route('/preview/record/:questionId', { name: 'preview_record_question',
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('showquestion', Meteor.subscribe("getInterviewQuestion", params._id));
      this.register('showquestionvideo', Meteor.subscribe("getInterviewQuestionVideo", params._id, Meteor.userId()));
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
  subscriptions: function(params, queryParams) {
    if(Meteor.isClient) {
      this.register('showquestion', Meteor.subscribe("getInterviewQuestion", params._id));
      this.register('showquestionvideo', Meteor.subscribe("getInterviewQuestionVideo", params._id, Meteor.userId()));
    }
  },
  triggersExit: [function() {
    if (typeof(a_player) !== "undefined") {
      a_player.dispose();
    }
  }],
  action: function() {
    BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyPreviewAnswerQuestion' }); } });




//////////// Template events, helpers


Template.CompanyLeftMenu.events({
  'click #add-new-form'(event, instance) {
    Meteor.call('add_new_form', function(err, data) {
      if (err) {
        toastr.error('Form cannot be created. Please review it!');
      }else {
        FlowRouter.go("edit_form", {formId: data});
      }
    });
  },
  'click #add-new-test'(event, instance) {
    Meteor.call('add_new_test', function(err, data) {
      if (err) {
        toastr.error('Form cannot be created. Please review it!');
      }else {
        FlowRouter.go("edit_form", {formId: data});
      }
    });
  },

  'click #add-new-keynote'(event, instance) {
    Meteor.call('add_new_keynote', function(err, data) {
      if (err) {
        toastr.error('Keynote cannot be created. Please review it!');
      }else {
        Meteor.call('add_new_slide', data, function(err2, data2) {
          if (err2) {
            toastr.error('Slide cannot be created. Please review it!');
          }else {
            FlowRouter.go("edit_keynote", {keynoteId: data});
          }
        });
      }
    });
  },

  'click #add-new-position'(event, instance) {
    $('.modal.add-new-position')
      .modal({
        //blurring: true,
        onDeny() {
          $('.ui.form').form('reset');
          $('.ui.form').form('clear');
          Session.set("position-success", false);
        },
        onApprove() {
          $('.ui.form')
            .form({
              fields: {
                positiontitle   : 'empty',
                opensat         : 'empty',
                endsat          : 'empty',
                description     : 'empty',
              }
            });

          if ($('.ui.form').form('is valid')) {
            const positiontitle = $('#positiontitle').val();
            const opensat = $('#opensat').val();
            const endsat = $('#endsat').val();
            const description = $('.fr-element.fr-view').html();
            Meteor.call('add_new_position', positiontitle, opensat, endsat, description, function (err, data) {
              if (err) {
                toastr.error(err.reason);
                Session.set("position-success", false);
              }else {
                Session.set("position-success", false);
                $(".ui.form").form('reset');
                $(".ui.form").form('clear');
                toastr.success('New Position has been added!');
                $('.modal.add-new-position').modal('hide');
                FlowRouter.go('list_positions');
              }
            });

            if (!Session.get("position-success")) {
              Session.set("position-success", false);
              return false;
            }
          }else {
            toastr.error('Please correct the errors!');
            return false;
          }
        }
      })
      .modal('show');
  },

  'click #add-new-question'(event, instance) {
    $('.modal.add-new-question')
      .modal({
        //blurring: true,
        onDeny() {
          $('.ui.form').form('reset');
          $('.ui.form').form('clear');
          Session.set("question-success", false);
        },
        onApprove() {
          $('.ui.form')
            .form({
              fields: {
                question      : 'empty',
                responsetime  : 'empty',
              }
            });

          if ($('.ui.form').form('is valid')) {
            const question = $('#question').val();
            const description = $('#description').val();
            const responsetime = $('#responsetime').val();
            Meteor.call('add_new_interview_question', question, description, responsetime, function (err, data) {
              if (err) {
                toastr.error(err.reason);
                Session.set("question-success", false);
              }else {
                Session.set("question-success", false);
                $(".ui.form").form('reset');
                $(".ui.form").form('clear');
                toastr.success('New Question has been added!');
                $('.modal.add-new-question').modal('hide');
                FlowRouter.go('list_questions');
              }
            });

            if (!Session.get("question-success")) {
              Session.set("question-success", false);
              return false;
            }
          }else {
            toastr.error('Please correct the errors!');
            return false;
          }
        }
      })
      .modal('show');
  },
});



Template.CompanyDashboard.helpers({
  company() {
    return Companies.findOne({ user: Meteor.userId()});
  },
  saved_positions() {
    return Positions.find({ user: Meteor.userId() }).count();
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
  var c = content.replace(new RegExp("[1][0-9]px","gm"), "6px");
  c = c.replace(new RegExp("[2][0-9]px","gm"), "9px");
  c = c.replace(new RegExp("[3-9][0-9]px","gm"), "12px");
  c = c.replace(new RegExp("<br>","gm"), "");
  c = c.replace(new RegExp("<p></p>","gm"), "");
  return c;
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
