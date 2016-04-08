// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../landing/main_navigation.html' // MainNavigation
import './layout.html'; // CompanyLayout
import './dashboard_main.html'; // CompanyDashboard
import './left_menu.html'; // CompanyLeftMenu


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



//////////// Template events, helpers
