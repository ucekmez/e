import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Keynotes,Slides } from '/imports/api/collections/keynotes.js'; // Keynotes collections

import './keynote_response.html'; // UserKeynoteResponseLayout


Template.UserKeynoteResponseLayout.onRendered(function() {
  $('body').addClass('ofhiddenforslide');
  $('html').addClass('ofhiddenforslide');
  FlowRouter.subsReady("showslides", function() {
    $.getScript("/js/reveal.js")
      .done(function(script, textStatus) {
        Reveal.initialize();
    });
  });

  Meteor.call('save_keynote_response_preview', FlowRouter.getParam('keynoteId'), function() {
    //console.log("keynote viewed!");
  });
});


Template.UserKeynoteResponseLayout.helpers({
  keynoteId() {
    return FlowRouter.getParam('keynoteId');
  },
  slides() {
    const result_keynote = Keynotes.findOne(FlowRouter.getParam('keynoteId'));
    if (result_keynote) {
      return Slides.find({keynote: result_keynote._id}, { sort: {order: 1} })
        .map(function(document, index) {
          document.index = index + 1;
          return document;
        });
    }
  },
});
