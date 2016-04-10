// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { Positions } from '/imports/api/collections/positions.js'; // Positions collections

import './add_new_position.html'; // CompanyAddNewPosition
import './list_positions.html'; // CompanyListPositions
import './edit_position.html'; // CompanyEditPositions


Template.CompanyAddNewPosition.onRendered(function() {
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
  getFEContext : function() {
    const self = this;
    return {
      //_value: self.description, // set HTML content
      //_keepMarkers: true, // preserving cursor markers
      //_className: "froala-reactive-meteorized-override", // Override wrapper class
      toolbarInline: false, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 2048,
      width: 'auto',
      height: '200',
      heightMax: '200',
      toolbarButtons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'color', 'align', 'formatOL', 'formatUL', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'undo'],
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
  'click #remove-position'(event, instance) {
    Meteor.call('remove_position', this._id);
  },
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
  position: function() {
    return Positions.findOne({_id: FlowRouter.getParam('positionId')});
  },

  getFEContext : function() {
    var self = this;
    return {
      _value: self.description, // set HTML content
      _keepMarkers: true, // preserving cursor markers
      _className: "froala-reactive-meteorized-override", // Override wrapper class
      toolbarInline: false, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 4096,
      widht: 'auto',
      height: '200',
      heightMax: '300',
      toolbarButtons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'color', 'align', 'formatOL', 'formatUL', 'insertHR', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'undo'],
      "_oncontentChanged": function (e, editor) { // FE save.before event handler function:
        // Get edited HTML from Froala-Editor
        var newHTML = editor.html.get(true);
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
