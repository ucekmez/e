// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../landing/main_navigation.html' // MainNavigation
import './layout.html'; // UserLayout
import './dashboard_main.html'; // UserDashboard
import './left_menu.html'; // UserLeftMenu


const userRoutes = FlowRouter.group({ prefix: '/user', name: 'user',
  triggersEnter: [function() {
    if (Meteor.loggingIn()) { BlazeLayout.render('LoadingLayout');}
    else {
      if (Meteor.userId() && Meteor.user()) {
        if (!Roles.userIsInRole(Meteor.userId(), ['user'])) {
          FlowRouter.go('notfound');
        }
      }else {
        FlowRouter.go('notfound');
      }
    }
  }]
});
userRoutes.route('/', { name: 'user_dashboard',
  action() { BlazeLayout.render('UserLayout', { nav: 'MainNavigation', left: 'UserLeftMenu', main: 'UserDashboard' }); } });



//////////// Template events, helpers
