// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { Positions, Applications } from '/imports/api/collections/positions.js'; // Positions collections
import { Responses, FormResponses } from '/imports/api/collections/forms.js'; // Forms collections
import { KeynoteResponses } from '/imports/api/collections/keynotes.js'; // Keynotes collection
import { PIResponses } from '/imports/api/collections/pis.js'; // PIs collection
import { VideoResponses } from '/imports/api/collections/videos.js'; // Videos collection

import './add_new_position.html'; // CompanyAddNewPosition
import './list_positions.html'; // CompanyListPositions
import './edit_position.html'; // CompanyEditPositions
import './list_applicant_responses.html'; // CompanyListApplicantPositionResponses
import './list_single_applicant_responses.html' // CompanyListSingleApplicantPositionResponses

import  Clipboard  from 'clipboard'; // from clipboard.js (npm dependency)

import '../generic_events.js';
import './process/process.js';

Template.CompanyAddNewPosition.onRendered(function() {
  $('.fr-add-new-position .fr-toolbar').addClass("ui segment");
  $('.fr-add-new-position .fr-wrapper').addClass("ui segment");
  $.getScript("/js/datetimepicker.js")
    .done(function(script, textStatus) {
      $('#opensat').datetimepicker({
        format:'Y-m-d',
        onShow:function( ct ){
         this.setOptions({
          minDate: 0,
          maxDate:$('#endsat').val()?moment($('#endsat').val()).subtract(1,'days').format('YYYY-MM-DD'):moment().add(10,'days').format('YYYY-MM-DD')
         })
        },
        timepicker:false
      });

      $('#endsat').datetimepicker({
        format:'Y-m-d',
        onShow:function( ct ){
         this.setOptions({
          minDate:$('#opensat').val()?moment($('#opensat').val()).add(1,'days').format('YYYY-MM-DD'):moment().add(1,'days').format('YYYY-MM-DD'),
          maxDate:$('#opensat').val()? moment($('#opensat').val()).add(30,'days').format('YYYY-MM-DD'):moment().add(30,'days').format('YYYY-MM-DD')
         })
        },
        timepicker:false
      });
  });
});


Template.CompanyAddNewPosition.helpers({
  getFEContext() {
    const self = this;
    return {
      //_value: self.description, // set HTML content
      //_keepMarkers: true, // preserving cursor markers
      _className: "fr-add-new-position", // Override wrapper class
      toolbarInline: false, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 2048,
      width: 'auto',
      height: '200',
      heightMax: '200',
      toolbarButtons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'color', 'align', 'formatOL', 'formatUL', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'undo'],
    };
  }
});


Template.CompanyListPositions.helpers({
  positions() {
    return Positions.find({ user: Meteor.userId() }, { sort: { createdAt : -1 }})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});


Template.CompanyListPositions.events({
  'click #add_new_position_right'(event, instance) {
    f_add_new_position(event, instance);
  },
  'click #remove-position'(event, instance) {
    Meteor.call('remove_position', this._id);
  },
  'click #export-position-to-applicants'(event, instance) {
    const _this = this;
    $('.modal.export-position-to-applicant')
      .modal({
        //blurring: true,
        onShow() {
          const clipboard = new Clipboard('.copytoclipboard');
          clipboard.on('success', function(e) {
            $('#copytext').html("Copied");
          });
          // console.log(_this); // _this = tikladigimiz form tablosuna isaret ediyor.
          $('.twelve.wide.column.export-position-to-applicant input')
            .val(FlowRouter.url('user_positionapply') + '/' + _this._id);

          const clipboardshort = new Clipboard('.copytoclipboardshort');
          clipboardshort.on('success', function(e) {
            $('#copytextshort').html("Copied");
          });
          // console.log(_this); // _this = tikladigimiz form tablosuna isaret ediyor.
          $('.twelve.wide.column.export-position-to-applicant-short input')
            .val(_this.shortid);
        },
        onHidden() {
          $('#copytext').html("Copy");
          $('#copytextshort').html("Copy");
        },
        onDeny() {},
        onApprove() {}
      })
      .modal('show');
  }
});


Template.CompanyEditPosition.onRendered(function() {
  $.getScript("/js/datetimepicker.js")
    .done(function(script, textStatus) {
      $('#opensat-edit').datetimepicker({
        format:'Y-m-d',
        onShow:function( ct ){
         this.setOptions({
          minDate: 0,
          maxDate:$('#endsat-edit').val()?moment($('#endsat-edit').val()).subtract(1,'days').format('YYYY-MM-DD'):moment().add(10,'days').format('YYYY-MM-DD')
         })
        },
        timepicker:false
      });

      $('#endsat-edit').datetimepicker({
        format:'Y-m-d',
        onShow:function( ct ){
         this.setOptions({
          minDate:$('#opensat-edit').val()?moment($('#opensat-edit').val()).add(1,'days').format('YYYY-MM-DD'):moment().add(1,'days').format('YYYY-MM-DD'),
          maxDate:$('#opensat-edit').val()? moment($('#opensat-edit').val()).add(30,'days').format('YYYY-MM-DD'):moment().add(30,'days').format('YYYY-MM-DD')
         })
        },
        timepicker:false
      });
  });
});


Template.CompanyEditPosition.onRendered(function() {
  $('.fr-edit-position .fr-toolbar').addClass("ui segment");
  $('.fr-edit-position .fr-wrapper').addClass("ui segment");
});

Template.CompanyEditPosition.events({
  'click #submit-button'(event, instance) {
    $('.ui.form')
      .form({
        fields: {
          positiontitle_edit   : 'empty',
          opensat_edit         : 'empty',
          endsat_edit          : 'empty',
          description_edit     : 'empty',
        }
      });

    if ($('.ui.form').form('is valid')) {
      const positiontitle = $('#positiontitle-edit').val();
      const opensat = $('#opensat-edit').val();
      const endsat = $('#endsat-edit').val();

      Meteor.call('edit_position', FlowRouter.getParam('positionId'), positiontitle, opensat, endsat, function (err, data) {
        if (err) {
          toastr.error(err.reason);
        }else {
          toastr.success('Position has been updated!');
          FlowRouter.go('list_positions');
        }
      });
    }else {
      toastr.error('Please correct the errors!');
    }
  }
});

Template.CompanyEditPosition.helpers({
  position() {
    const result_position = Positions.findOne(FlowRouter.getParam('positionId'));
    if (result_position) {
      if (result_position.user === Meteor.userId()) {
        return result_position;
      }else {
        FlowRouter.go('notfound');
      }
    }
  },

  getFEContext() {
    const self = this;
    return {
      _value: self.description, // set HTML content
      _keepMarkers: true, // preserving cursor markers
      _className: "fr-edit-position", // Override wrapper class
      toolbarInline: false, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 4096,
      width: 'auto',
      height: '240',
      heightMax: '240',
      toolbarButtons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'color', 'align', 'formatOL', 'formatUL', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'undo'],
      "_oncontentChanged": function (e, editor) { // FE save.before event handler function:
        // Get edited HTML from Froala-Editor
        const newHTML = editor.html.get(true);
        // Do something to update the edited value provided by the Froala-Editor plugin, if it has changed:
        if (!_.isEqual(newHTML, self.description)) {
          Positions.update({_id: self._id}, {
            $set: {description: newHTML}
          });
          toastr.success('Description is automatically saved!');
        }
        return false; // Stop Froala Editor from POSTing to the Save URL
      },
    };
  }
});



/////////////////   CompanyListApplicantPositionResponses

Template.CompanyListApplicantPositionResponses.helpers({
  position_title() {
    return Positions.findOne(FlowRouter.getParam('positionId')).title;
  },
  responses() {
    return Applications.find({ position: FlowRouter.getParam('positionId') })
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
});


Template.CompanyListSingleApplicantPositionResponses.helpers({
  response() {
    return Applications.findOne(FlowRouter.getParam('applicationId'));
  }
});


////////////////// registerHelpers

Template.registerHelper("get_form_response", function(response_id){
  return Responses.findOne(response_id);
});

Template.registerHelper("get_form_response_itself", function(response_id){
  return FormResponses.findOne({ response: response_id });
});

Template.registerHelper("get_number_of_questions", function(fields){
  return fields.length;
});

Template.registerHelper("form_response_dateFromNow", function(response_id){
  const formresponse = FormResponses.findOne({ response: response_id });
  if (formresponse) {
    Session.get('time');
    return moment(formresponse.createdAt).fromNow();
  }
});

Template.registerHelper("get_keynote_response", function(response_id){
  return KeynoteResponses.findOne(response_id);
});

Template.registerHelper("get_pi_response", function(response_id){
  return PIResponses.findOne(response_id);
});


Template.registerHelper("get_video_response", function(response_id){
  return VideoResponses.findOne(response_id);
});
