// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Slides, Keynotes } from '/imports/api/collections/keynotes.js'; // Keynotes collections

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../landing/main_navigation.html' // MainNavigationx
import './layout.html'; // CompanyLayout
import './dashboard_main.html'; // CompanyDashboard
import './left_menu.html'; // CompanyLeftMenu

// ******************** //

import './forms/forms.js';
import './keynotes/keynotes.js';

// ******************** //


const companyRoutes = FlowRouter.group({ prefix: '/company', name: 'company',
  triggersEnter: [function() {
    if (Meteor.userId()) {
      if (!Roles.userIsInRole(Meteor.userId(), ['company'])) {
        FlowRouter.go('home');
      }
    }else {
      FlowRouter.go('home');
    }
  }]
});
companyRoutes.route('/', { name: 'company_dashboard',
  action() { BlazeLayout.render('CompanyLayout', { nav: 'MainNavigation', left: 'CompanyLeftMenu', main: 'CompanyDashboard' }); } });


//************ forms routes

const companyFormRoutes = companyRoutes.group({ prefix: "/forms", name: "companyforms"});
companyFormRoutes.route('/edit/:formId', { name: 'edit_form',
  action: function(params) {
    BlazeLayout.render('CompanyEditFormLayout', { nav: 'MainNavigation', main: 'CompanyEditForm' }); } });
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

  return month + "/" + day + "/" + date.getFullYear();
});


Template.registerHelper("ifEqualSelect", function(v1, v2) {
  if (v1 === v2) return "selected";
});
