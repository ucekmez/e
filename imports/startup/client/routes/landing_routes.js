import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:semantic-ui';

import '../../../ui/landing/landing.js';

//////// main page routes
FlowRouter.route('/', { name: 'home',
  triggersEnter: [function() {
    Tracker.autorun(function(){
      if (Meteor.userId()) {
        const loggedInUserId = Meteor.userId();
        if (Roles.userIsInRole(loggedInUserId, ['admin'])) {
          FlowRouter.go('admin_dashboard');
        }else if(Roles.userIsInRole(loggedInUserId, ['company'])) {
          FlowRouter.go('company_dashboard');
        }else {
          FlowRouter.go('user_dashboard');
        }
      }
    });
  }],
  action() { BlazeLayout.render('LandingLayout');}
});


//////// not found route
FlowRouter.notFound = {
  action() {BlazeLayout.render('NotFoundLayout');}
};
