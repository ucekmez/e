import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:semantic-ui';

import '../../../ui/landing/landing.js';
import '/imports/ui/landing/loading.html';
import './not_found.js';

//////// main page routes
FlowRouter.route('/', { name: 'home',
  triggersEnter: [function() {
    Tracker.autorun(function(){
      if (Meteor.userId() && Meteor.user() && typeof(Meteor.user().roles) !== "undefined") {
        const loggedInUserId = Meteor.userId();
        if (Roles.userIsInRole(loggedInUserId, ['user'])) {
          FlowRouter.go('user_dashboard');
        }else if (Roles.userIsInRole(loggedInUserId, ['company'])) {
          FlowRouter.go('company_dashboard');
        }else if (Roles.userIsInRole(loggedInUserId, ['admin'])) {
          FlowRouter.go('admin_dashboard');
        }
      }
    });
  }],
  action() { BlazeLayout.render('LandingLayout');}
});
