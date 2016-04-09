import './landing_routes.js';
import './admin_routes.js';
import './company_routes.js';
import './user_routes.js';

// her sayfada kullanici oturum acana kadar loading ekranini gosterir
FlowRouter.triggers.enter([function() {
  if (Meteor.loggingIn()) { BlazeLayout.render('LoadingLayout');}
}]);
