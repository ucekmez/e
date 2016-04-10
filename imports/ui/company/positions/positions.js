// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { Positions } from '/imports/api/collections/positions.js'; // Positions collections

import './add_new_position.html'; // CompanyAddNewPosition
import './list_positions.html'; // CompanyListPositions


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
