import { Template } from 'meteor/templating';
import { Forms } from '/imports/api/collections/forms.js'; // Forms collections

import './edit_form.html'; // CompanyEditFormLayout CompanyEditForm
import './list_forms.html'; // CompanyListForms
import './preview_form.html'; // CompanyPreviewForm



Template.CompanyEditForm.onRendered(function() {
  FlowRouter.subsReady("getformpreview", function() {
    const form = Forms.findOne({_id: FlowRouter.getParam('formId')});

    if (form && form.user === Meteor.userId()) {
      fb = new Formbuilder({ selector: '.fb-main', bootstrapData: form.payload ? JSON.parse(form.payload).fields : [], workingFormType: form.type });
      fb.on('save', function(payload) {
        Meteor.call("update_form_payload", form._id, payload, function(data) {
          toastr.info("Form updated!");
        });
      });
      if (form.type == 'test') {
          $("a[data-field-type='address']").remove();
          $("a[data-field-type='number']").remove();
          $("a[data-field-type='date']").remove();
          $("a[data-field-type='paragraph']").remove();
          $("a[data-field-type='range_group']").remove();
          $("a[data-field-type='dropdown']").remove();
          $("a[data-field-type='section_break']").remove();
      }
    }
  });
});


Template.CompanyListForms.helpers({
  forms() {
    return Forms.find({ user: Meteor.userId() },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.CompanyListForms.events({
  'click #remove-form'(event, instance) {
    Meteor.call('remove_form', this._id);
  }
});


Template.CompanyPreviewForm.helpers({
  form() {
    const frm = Forms.findOne({ _id: FlowRouter.getParam('formId') });
    Frm = frm;
    return frm;
  }
});

Template.registerHelper('toJSON', function(payload){
  return JSON.parse(payload);
});

Template.registerHelper('equals', function(s1, s2){
  return s1 === s2;
});
