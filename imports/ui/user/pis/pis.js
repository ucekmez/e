import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { PIs, PIGroups, PIResponses } from '/imports/api/collections/pis.js'; // PIs collections

import './pi_response.html'; // UserPIResponseLayout


Template.UserPIResponseLayout.helpers({
  pi() {
    const combination = PIGroups.findOne(FlowRouter.getParam('piId'));
    if (combination) {
      const scales = PIs.find({ _id: { $in : combination.scales }}).fetch();
      if (scales.length > 0) {
        const phrases = new Array();
        scales.forEach(function(scale) {
          let index = 0;
          scale.phrases.forEach(function(phrase) {
            phrases.push({ scale: scale._id, phrase: phrase, index: index++ });
          });
        });
        for(let i=0;i<phrases.length;i++) {
          const rnd = Math.floor(Math.random() * phrases.length);
          const tmp = phrases[i];
          phrases[i] = phrases[rnd];
          phrases[rnd] = tmp;
        }
        return phrases;
      }
    }
  }
});

Template.UserPIResponseLayout.events({
  'click #submit-button'(event, instance) {
    const combination = PIGroups.findOne(FlowRouter.getParam('piId'));
    if (combination) {
      const scales = PIs.find({ _id: { $in : combination.scales }}).fetch();

      const field_validations = {};
      scales.forEach(function(scale) {
        let index = 0;
        scale.phrases.forEach(function(phrase) {
          field_validations[`${scale._id}__${index}`] = 'checked';
          index++;
        });
      });

      $('.ui.form')
        .form({
          fields: field_validations
      });

      if ($('.ui.form').form('is valid')) {
        var response = new Array();
        scales.forEach(function(scale) {
          let index = 0;
          const phrases = new Array();
          scale.phrases.forEach(function(phrase) {
            const selected = $(`input[name=${scale._id}__${index}]:checked`);
            if (selected.length > 0) {
              phrases.push(parseInt(selected.val()));
            }
            index++;
          });
          response.push({ scale: scale._id, selecteds: phrases});
        });

        Meteor.call('add_new_pi_response', response, FlowRouter.getParam('piId'), function(err, data) {
          if (!err) {
            toastr.info("Your response has been saved!");
            FlowRouter.go('home');
          }else {
            toastr.warning(err);
          }
        });


      }else {
        toastr.warning("Please answer all questions!");
      }
    }
  }
});






//
