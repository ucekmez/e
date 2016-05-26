import { Template } from 'meteor/templating';
import { PIs, PIGroups, PIResponses } from '/imports/api/collections/pis.js'; // Personal Inventory collections
import { FlowRouter } from 'meteor/kadira:flow-router';

import './create_new_pi.html';
import './list_combinations.html';
import './preview_pi.html';
import './list_applicant_responses.html';

import  Clipboard  from 'clipboard'; // from clipboard.js (npm dependency)

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
  },
  'click #export-pi-to-applicants'(event, instance) {
    const _this = this;
    $('.modal.export-pi-to-applicant')
      .modal({
        //blurring: true,
        onShow() {
          const clipboard = new Clipboard('.copytoclipboard');
          clipboard.on('success', function(e) {
            $('#copytext').html("Copied");
          });
          // console.log(_this); // _this = tikladigimiz form tablosuna isaret ediyor.
          $('.twelve.wide.column.export-pi-to-applicant input')
            .val(FlowRouter.url('user_piresponse') + '/' + _this._id);
        },
        onHidden() {
          $('#copytext').html("Copy");
        },
        onDeny() {},
        onApprove() {}
      })
      .modal('show');
  },
});



//////////

Template.CompanyPreviewPI.helpers({
  // burada shuffle ediyoruz
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

Template.CompanyPreviewPI.events({
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
            FlowRouter.go('list_combinations');
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





Template.CompanyPreviewPIResponse.helpers({
  group_name() {
    const pi_group = PIGroups.findOne(FlowRouter.getParam('piId'));
    if (pi_group) {
      return pi_group.name;
    }
  },
  response() {
    const pi_response = PIResponses.findOne({ $and : [{ group: FlowRouter.getParam('piId')}, {user: Meteor.userId()}]});

    if (pi_response) {
      return f_get_pi_response(pi_response);
    }
  }
});



Template.CompanyListApplicantPIResponses.helpers({
  group_name() {
    const pi_group = PIGroups.findOne(FlowRouter.getParam('piId'));
    if (pi_group) {
      return pi_group.name;
    }
  },
  responses() {
    return PIResponses.find({ group: FlowRouter.getParam('piId') }, { sort : {createdAt: -1} })
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.CompanyPreviewApplicantPIResponse.helpers({
  pi() {
    const pi_response = PIResponses.findOne(FlowRouter.getParam('responseId'));
    if (pi_response) {
      const pi = PIGroups.findOne(pi_response.group);
      return pi;
    }
  },
  user_info() {
    const pi_response = PIResponses.findOne(FlowRouter.getParam('responseId'));
    if (pi_response) {
      if (pi_response.user_name) {
        return pi_response.user_name;
      }else {
        return pi_response.email;
      }
    }
  },
  response() {
    const pi_response = PIResponses.findOne(FlowRouter.getParam('responseId'));
    if (pi_response) {
      return f_get_pi_response(pi_response);
    }
  }
});


// helper functions

f_get_pi_response = function(pi_response) {
  const response_json = JSON.parse(pi_response.response);
  // ornek bir response : [{scale: "pkkfJ5KuBiPmAmmoQ", selecteds: [2, 5, 1, 1, 3]}]
  const result = new Array();
  response_json.forEach(function(scale, index1) {
    const scale_response = {};
    const scale_collection = PIs.findOne(scale.scale);
    if (scale_collection) {
      scale_response['scale'] = scale_collection.scale; // scale ismi
      const scale_phrases = new Array();
      scale.selecteds.forEach(function(selected, index2) {
        scale_phrases.push({phrase: scale_collection.phrases[index2], selected: selected});
      });
      scale_response['phrases'] = scale_phrases;
      result.push(scale_response);
    }
  });
  return result;
}

Template.registerHelper("coming_from_single_pis", function(){
  return Session.get("coming_from") === "single_pis";
});

Template.registerHelper("current_application_id", function(){
  return Session.get("current_application_id");
});
