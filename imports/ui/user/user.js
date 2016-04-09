// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../landing/main_navigation.html' // MainNavigation
import './layout.html'; // UserLayout
import './dashboard_main.html'; // UserDashboard
import './left_menu.html'; // UserLeftMenu


const userRoutes = FlowRouter.group({ prefix: '/user', name: 'user',
  triggersEnter: [function() {
    if (Meteor.userId()) {
      if (!Roles.getRolesForUser(Meteor.userId()) > 0) {
        FlowRouter.go('home');
      }
    }else {
      FlowRouter.go('home');
    }
  }]
});
userRoutes.route('/', { name: 'user_dashboard',
  action() { BlazeLayout.render('UserLayout', { nav: 'MainNavigation', left: 'UserLeftMenu', main: 'UserDashboard' }); } });



//////////// Template events, helpers
