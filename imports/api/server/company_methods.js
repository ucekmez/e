import { Forms } from '/imports/api/collections/forms.js';
import { Slides, Keynotes } from '/imports/api/collections/keynotes.js';

Meteor.methods({
  add_new_form(){
    const form_id = Forms.insert({
      title: "New Survey Form",
      createdAt: new Date(),
      user: Meteor.userId(),
      type: "form"
    });

    return form_id;
  },

  add_new_test(){
    const form_id = Forms.insert({
      title: "New Test Form",
      createdAt: new Date(),
      user: Meteor.userId(),
      type: "test"
    });

    return form_id;
  },

  remove_form(id) {
    Forms.remove(id);
  },

  add_new_keynote() {
    var keynote_id = Keynotes.insert({
      title: "New Keynote",
      createdAt: new Date(),
      user: Meteor.userId()
    });
    return keynote_id;
  },

  add_new_slide(keynote_id) {
    Slides.insert({
      content : '<p><span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">Head</span></span></span></p><p><span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">Text text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text t<span style="font-size: 24px;"><span style="color: rgb(41, 105, 176);"><span style="font-family: Verdana,Geneva,sans-serif;">ext text text text&nbsp;</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></p><ul><li>Input List</li><li>Input List</li><li>Input List</li><li>Input list</li></ul><hr>',
      created_at : new Date(),
      order : 0,
      keynote : keynote_id,
      user : Meteor.userId(),
    });
  },

  remove_keynote(id) {
    Keynotes.remove(id);
    const slides = Slides.find({keynote: id});
    for(let i=0;i<sides.count();i++) {
      slides.remove();
    }
  },

});
