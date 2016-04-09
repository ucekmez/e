// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../landing/main_navigation.html' // MainNavigation
import './layout.html'; // CompanyLayout
import './dashboard_main.html'; // CompanyDashboard
import './left_menu.html'; // CompanyLeftMenu

// ******************** //

import './forms/forms.js'

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
//companyFormRoutes.route('/list', { name: 'list_forms',
//  action: function() {
//    BlazeLayout.render('CompanyLayout', { nav: 'Nav', left: 'CompanyLeftMenu', main: 'CompanyListForms' }); } });



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
});
