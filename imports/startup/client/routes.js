import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/landing/landing.js';

//////// main page routes
FlowRouter.route('/', { name: 'home',
  action() {
    BlazeLayout.render('LandingLayout');
  }
});
