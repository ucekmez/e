import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../../ui/admin/admin.js';
import '../../../ui/company/company.js';
import '../../../ui/user/user.js';


import '../../../ui/landing/landing.js';
import '/imports/ui/landing/loading.html';


FlowRouter.triggers.enter([() => {
  NProgress.start();
}]);

FlowRouter.notFound = {
  name: 'notfound',
  action() {
    BlazeLayout.render('NotFoundLayout');
    NProgress.done();
  }
};

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
  action() {
    BlazeLayout.render('LandingLayout');
    NProgress.done();
  }
});
