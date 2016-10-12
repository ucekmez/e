// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Companies } from '/imports/api/collections/companies.js';
import { Forms, FormResponses } from '/imports/api/collections/forms.js';
import { InterviewQuestions, VideoResponses } from '/imports/api/collections/videos.js';
import { Keynotes, KeynoteResponses } from '/imports/api/collections/keynotes.js';


import '../landing/main_navigation.html' // MainNavigation
import '../landing/not_found.html' // NotFoundLayout
import './add_new_company.html'; // AdminDashboard
import './layout.html'; // AdminLayout
import './left_menu.html'; // AdminLeftMenu
import './dashboard_main.html'; // AdminDashboard
import './list_companies.html'; // AdminListCompanies


const adminRoutes = FlowRouter.group({ prefix: '/admin', name: 'admin',
  triggersEnter: [() => {
    if (Meteor.userId() && Meteor.user()) {
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) { FlowRouter.go('home'); }
    }else { FlowRouter.go('home'); }
  }],
});

adminRoutes.route('/', { name: 'admin_dashboard',
  breadcrumb: {
    title: "Dashboard"
  },
  action() {
    BlazeLayout.render('AdminLayout', { nav: 'MainNavigation', left: 'AdminLeftMenu', main: 'AdminDashboard' });
    NProgress.done();
  } });
adminRoutes.route('/companies', { name: 'list_companies',
  breadcrumb: {
    title: "List Companies",
    parent: "admin_dashboard"
  },
  action() {
    BlazeLayout.render('AdminLayout', { nav: 'MainNavigation', left: 'AdminLeftMenu', main: 'AdminListCompanies' });
    NProgress.done();
  } });



//////////// Template events, helpers

Template.AdminLeftMenu.events({
  'click #add-new-company'(event, instance) {
    $('.modal.add-new-company')
      .modal({
        //blurring: true,
        onDeny() {
          $('.ui.form').form('reset');
          $('.ui.form').form('clear');
          Session.set("success", false);
        },
        onApprove() {
          $('.ui.form')
            .form({
              fields: {
                companyname   : 'empty',
                email         : 'empty',
                password      : ['minLength[4]', 'empty'],
              }
            });

            if ($('.ui.form').form('is valid')) {
              const companyname = $('#companyname').val();
              const email = $('#email').val();
              const password = $('#password').val();
              Meteor.call('add_new_company', companyname, email, password, function (err, data) {
                if (err) {
                  toastr.error(err.reason);
                  Session.set("success", false);
                }else {
                  Session.set("success", false);
                  $(".ui.form").form('reset');
                  $(".ui.form").form('clear');
                  toastr.success('New Company has been added!');
                  $('.modal.add-new-company').modal('hide');
                  FlowRouter.go('list_companies'); // company ekleyince duzenleme sayfasina veya company listesine gidebilir
                }
              });

              if (!Session.get("success")) {
                Session.set("success", false);
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

Template.AdminListCompanies.helpers({
  companies() {
    return Companies.find({}, {sort: {createdAt : -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.AdminListCompanies.events({
  'click #remove-company'(event, instance) {
    Meteor.call('remove_company', this._id);
  },
});




/// registerHelpers

Template.registerHelper('countCompanyForms', function(company_id){
  const company = Companies.findOne(company_id);
  if (company) {
    return Forms.find({ user: company.user }).count();
  }
});

Template.registerHelper('countCompanyFormResponses', function(company_id){
  const company = Companies.findOne(company_id);
  if (company) {
    const forms = FormResponses.find({ user: company.user }).fetch();
    if (forms) {
      let total_responses = 0;
      forms.forEach(function(form) {
        total_responses += FormResponses.find({ form: form._id}).count();
      });
      return total_responses;
    }
  }
});

Template.registerHelper('countCompanyKeynotes', function(company_id){
  const company = Companies.findOne(company_id);
  if (company) {
    return Keynotes.find({ user: company.user }).count();
  }
});

Template.registerHelper('countCompanyKeynoteResponses', function(company_id){
  const company = Companies.findOne(company_id);
  if (company) {
    const keynotes = Keynotes.find({ user: company.user }).fetch();
    if (keynotes) {
      let total_responses = 0;
      keynotes.forEach(function(keynote) {
        total_responses += KeynoteResponses.find({ keynote: keynote._id}).count();
      });
      return total_responses;
    }
  }
});

Template.registerHelper('countCompanyVideos', function(company_id){
  const company = Companies.findOne(company_id);
  if (company) {
    return InterviewQuestions.find({ user: company.user }).count();
  }
});

Template.registerHelper('countCompanyVideoResponses', function(company_id){
  const company = Companies.findOne(company_id);
  if (company) {
    const questions = InterviewQuestions.find({ user: company.user }).fetch();
    if (questions) {
      let total_responses = 0;
      questions.forEach(function(question) {
        total_responses += VideoResponses.find({ question: question._id}).count();
      });
      return total_responses;
    }
  }
});
