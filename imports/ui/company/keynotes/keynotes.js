import { Template } from 'meteor/templating';
import { Slides, Keynotes } from '/imports/api/collections/keynotes.js'; // Keynotes collections

import './edit_keynote.html';
import './list_keynotes.html';
import './preview_keynote.html';



Template.CompanyListKeynotes.helpers({
  keynotes() {
    return Keynotes.find({ user: Meteor.userId() },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});


Template.CompanyListKeynotes.events({
  'click #remove-keynote'(event, instance) {
    Meteor.call('remove_keynote', this._id);
  }
});

Template.CompanyEditKeynote.helpers({
  slides() {
    return Slides.find({keynote: FlowRouter.getParam('keynoteId')}, { sort: {order: 1} });
  },
  sortableOptions() {
    return {
      sort: true,
      group: {
        scroll: true,
        name: 'slidesSortGroup',
        pull: false
      },
      onSort: function(event) {
        Slides.update({_id: event.data._id}, {
          $set: {x: event.data.order * 1000}
        });
      }
    }
  }
});


Template.CompanyEditKeynote.events({
  'click #slide-add-icon': function(event, template) {
    const slides_cursor = Slides.find({keynote: FlowRouter.getParam('keynoteId')});
    const slides_count = slides_cursor.count();
    const slides = slides_cursor.fetch();

    let last_order = 0;
    if (slides_count > 0) {
      last_order = slides[slides_count - 1].order + 1;
    }

    const new_empty_slide_id = Slides.insert({
      content : "",
      created_at : new Date(),
      order : last_order,
      x: last_order * 1000,
      y: 0,
      z: 0,
      keynote : FlowRouter.getParam('keynoteId'),
      user : Meteor.userId(),
    });
    console.log("yeni slide " + last_order + ". siraya eklendi");
  },
  'click #slide-delete-icon': function(event, template) {
    const thisslide = Slides.findOne(this._id);
    Slides.remove(this._id);
  },

  'click #thumbnail': function() {
    if (!Session.get("active-slide-before")) {
      Session.set("active-slide-before", this._id);
      //$('#start-editing').addClass('passive');
    }else {
      //$('#start-editing').addClass('passive');
      $('#slide-' + Session.get("active-slide-before")).removeClass('active').addClass('passive');
      Session.set("active-slide-before", this._id);
    }
    $('#slide-' + this._id).removeClass('passive').addClass('active');
  }
});

Template.EditSingleSlide.onRendered(function() {
  $('.fr-toolbar').addClass("ui segment");
  $('.fr-wrapper').addClass("ui segment");
});

Template.EditSingleSlide.helpers({
  getFEContext : function() {
    const self = this;
    return {
      _value: self.content, // set HTML content
      _keepMarkers: true, // preserving cursor markers
      _className: "froala-reactive-meteorized-override", // Override wrapper class
      toolbarInline: false, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 2048,
      width: 'auto',
      height: '360',
      heightMax: '360',
      toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '|', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
      "_oncontentChanged": function (e, editor) { // FE save.before event handler function:
        // Get edited HTML from Froala-Editor
        const newHTML = editor.html.get(true /* keep_markers */);
        // Do something to update the edited value provided by the Froala-Editor plugin, if it has changed:
        if (!_.isEqual(newHTML, self.content)) {
          Slides.update({_id: self._id}, {
            $set: {content: newHTML}
          });
          toastr.success('Keynote saved!');
        }
        return false; // Stop Froala Editor from POSTing to the Save URL
      },
    };
  }
});


//////////////// preview layout functions

// KeynotePreview functions
Template.CompanyKeynotePreviewLayout.onRendered(function() {
  Session.set("inlineedit", false)
  $('body').addClass('ofhiddenforslide');
  $('html').addClass('ofhiddenforslide');
  FlowRouter.subsReady("showslides", function() {
    $.getScript("/js/reveal.js")
      .done(function(script, textStatus) {
        Reveal.initialize();
    });
  });
});


Template.CompanyKeynotePreviewLayout.events({
  'click #edit-inline-keynote'(event, instance) {
    let edit = Session.get("inlineedit");
    if (!edit) {
      $('.showsingleslide').hide();
      $('.editsingleslide').show();
      $('#edit-inline-keynote').addClass("active");
      $('#edit-inline-keynote').html("Close Inline Edit")
      Session.set("inlineedit", true);
    }else {
      $('.showsingleslide').show();
      $('.editsingleslide').hide();
      $('#edit-inline-keynote').removeClass("active");
      $('#edit-inline-keynote').html("Open Inline Edit")
      Session.set("inlineedit", false);
    }
  }
});

Template.CompanyKeynotePreviewLayout.helpers({
  keynoteId() {
    return FlowRouter.getParam('keynoteId');
  },
  slides() {
    return Slides.find({keynote: FlowRouter.getParam('keynoteId')}, { sort: {order: 1} })
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  getFEContext() {
    const self = this;
    return {
      _value: self.content, // set HTML content
      _keepMarkers: true, // preserving cursor markers
      _className: "froala-reactive-meteorized-override", // Override wrapper class
      toolbarInline: true, // Set some FE options
      initOnClick: false, // Set some FE options
      tabSpaces: false, // Set some FE options
      disableRightClick: false,
      maxCharacters: 2048,
      width: 'auto',
      height: '400',
      heightMax: '600',
      toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '|', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
      "_oncontentChanged": function (e, editor) { // FE save.before event handler function:
        // Get edited HTML from Froala-Editor
        const newHTML = editor.html.get(true /* keep_markers */);
        // Do something to update the edited value provided by the Froala-Editor plugin, if it has changed:
        if (!_.isEqual(newHTML, self.content)) {
          Slides.update({_id: self._id}, {
            $set: {content: newHTML}
          });
          toastr.success('Keynote saved!', {"positionClass": "toast-top-right",});
        }
        return false; // Stop Froala Editor from POSTing to the Save URL
      },
    };
  }
});



///// registerHelper functions


Template.registerHelper("numberOfSlides", function(id){
  return Slides.find({ keynote: id }).count();
});
