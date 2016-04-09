import { Forms } from '/imports/api/collections/forms.js';

Meteor.methods({
  add_new_form(){
    const form_id = Forms.insert({
      title: "New Survey Form",
      createdAt: new Date(),
      user: Meteor.userId(),
      type: "form"
    });

    return form_id;
  },

  add_new_test(){
    const form_id = Forms.insert({
      title: "New Test Form",
      createdAt: new Date(),
      user: Meteor.userId(),
      type: "test"
    });

    return form_id;
  },

});
