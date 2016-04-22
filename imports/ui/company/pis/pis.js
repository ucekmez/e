import { Template } from 'meteor/templating';
import { PIs, PIGroups } from '/imports/api/collections/pis.js'; // Personal Inventory collections
import { FlowRouter } from 'meteor/kadira:flow-router';

import './create_new_pi.html';
import './list_combinations.html';
import './preview_pi.html';

import '../generic_events.js';


Template.CompanyAddNewPICombination.helpers({
  pis() {
    return PIs.find()
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});


Template.CompanyAddNewPICombination.events({
  'click #create_pi_combination'(event, instance) {
    const chosens = $('.check-pis:checked').map(function() {return this.value;}).get();
    const name = $('#combination-name').val();

    $('.ui.form')
      .form({
        fields: {
          combination_name  : 'empty',
        }
      });

    if ($('.ui.form').form('is valid')) {
      if (!name) {
        toastr.warning("Enter a name for your custom PI");
      }else if(chosens.length === 0) {
        toastr.warning("Please make a selection!");
      }else {
        Meteor.call('create_private_pi', chosens, name, function(err, data) {
          if (data) {
            toastr.info('Combination has been created!');
            FlowRouter.go('list_combinations');
          }else {
            toastr.warning(err);
          }
        });
      }
    }
  },
});




/////////


Template.CompanyListPICombinations.helpers({
  combinations() {
    return PIGroups.find({ user: Meteor.userId()})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
});

Template.CompanyListPICombinations.events({
  'click #remove-combination'(event, instance) {
    Meteor.call('remove_combination', this._id);
  }
});



//////////

Template.CompanyPreviewPI.helpers({
  pi() {
    const combination = PIGroups.findOne(FlowRouter.getParam('piId'));
    if (combination) {
      const scales = PIs.find({ _id: { $in : combination.scales }}).fetch();
      if (scales.length > 0) {
        const phrases = new Array();
        let index = 0;
        scales.forEach(function(scale) {
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
