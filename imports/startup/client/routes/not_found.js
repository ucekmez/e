import { FlowRouter } from 'meteor/kadira:flow-router';


//////// not found route
FlowRouter.notFound = {
  name: 'notfound',
  action() {BlazeLayout.render('NotFoundLayout');}
};
