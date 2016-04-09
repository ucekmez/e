import { Template } from 'meteor/templating';
import { Forms } from '/imports/api/collections/forms.js'; // Forms collections
import './edit_form.html';



Template.CompanyEditForm.onRendered(function() {
  const form = Forms.findOne({_id: FlowRouter.getParam('formId')});

  Tracker.autorun(function() {
    if (form) {
      fb = new Formbuilder({ selector: '.fb-main', bootstrapData: form.payload ? JSON.parse(form.payload).fields : [], workingFormType: form.type });
      fb.on('save', function(payload) {
        Forms.update({ _id: form._id }, { $set: { payload: payload } });
        toastr.info("Form updated!");
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
