// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Companies } from '/imports/api/collections/companies.js';

import './add_new_company.html'; // AdminDashboard
import './layout.html'; // AdminLayout
import './left_menu.html'; // AdminLeftMenu
import './dashboard_main.html'; // AdminDashboard
import './list_companies.html'; // AdminListCompanies


const adminRoutes = FlowRouter.group({ prefix: '/admin', name: 'admin',
  triggersEnter: [function() {
    if (Meteor.userId()) {
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        FlowRouter.go('home');
      }
    }
  }]
});
adminRoutes.route('/', { name: 'admin_dashboard',
  action() { BlazeLayout.render('AdminLayout', { nav: 'MainNavigation', left: 'AdminLeftMenu', main: 'AdminDashboard' }); } });
adminRoutes.route('/companies', { name: 'list_companies',
  action() { BlazeLayout.render('AdminLayout', { nav: 'MainNavigation', left: 'AdminLeftMenu', main: 'AdminListCompanies' }); } });



//////////// Template events, helpers

Template.AdminLeftMenu.events({
  'click #add-new-company'(event, instance) {
    $('.modal.add-new-company')
      .modal({
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
