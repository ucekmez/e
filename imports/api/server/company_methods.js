import { Forms, Responses, FormResponses } from '/imports/api/collections/forms.js';
import { Slides, Keynotes } from '/imports/api/collections/keynotes.js';
import { Positions } from '/imports/api/collections/positions.js';
import { InterviewQuestions, PreviewVideos, Videos } from '/imports/api/collections/videos.js';

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

  update_form_payload(id, payload) {
    Forms.update({ _id: id }, { $set: { payload: payload } });
  },

  add_new_keynote() {
    const keynote_id = Keynotes.insert({
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
    Slides.remove({keynote: id});
  },

  add_new_position(positiontitle, opensat, endsat, description){
    const position_id = Positions.insert({
      title: positiontitle,
      description: description,
      opensAt: opensat,
      endsAt: endsat,
      user: Meteor.userId()
    });

    return position_id;
  },

  edit_position(id, title, opensat, endsat) {
    Positions.update({ _id: id }, {
      $set: {title: title, opensAt: opensat, endsAt: endsat}
    });
    //console.log("editposition: " + id + " " + title + " " + opensat + " " + endsat);
  },

  remove_position(id) {
    Positions.remove(id);
  },


  add_new_interview_question(question, description, responsetime) {
    let time = 90;
    if (responsetime == 30) { time = 30; }
    else if (responsetime == 60) { time = 60; }

    const question_id = InterviewQuestions.insert({
      content: question,
      description: description,
      user: Meteor.userId(),
      time: time
    });

    return question_id;
  },

  edit_interview_question(id, question, description, responsetime) {
    let time = 90;
    if (responsetime == 30) { time = 30; }
    else if (responsetime == 60) { time = 60; }

    InterviewQuestions.update({ _id: id }, {
      $set: {
        content: question,
        description: description,
        time: time
      }});
  },

  remove_question(id) {
    InterviewQuestions.remove(id);
  },

  // form responses
  add_new_response(response, form_id) {
    const form = Forms.findOne(form_id);
    if (form.type === 'test') { // eger islenecek form test ise
      const fields = JSON.parse(form.payload).fields;

      response.forEach(function(element, index) {
        if (element.type === "radio") {
          for(let i=0; i<fields[index].field_options.options.length;i++) {
            // sirayla form yapisini dolasip hangi sorularin elimizdeki
            // cevaplarla uyustugunu belirliyoruz ( secenekleri kiyasliyoruz )
            if (element.val === fields[index].field_options.options[i].label) {
              // eger o form yapisinda truechoice degeri girilmisse bu true veya false olabilir
              if (typeof(fields[index].field_options.options[i].truechoice) !== 'undefined') {
                if (fields[index].field_options.options[i].truechoice) { // cevap dogru ise
                  element.result = true;
                }else { // cevap yanlis ise
                  element.result = false;
                }
              }else { // dogru-yanlsi degeri yoksa default olarak yanlis sayiyoruz
                element.result = false;
              }
            }
          }
        }else { // eger checkboxes ise, bu durumda birden fazla secenek secili olabilir
          element.result = [];
          for(let i=0; i<fields[index].field_options.options.length;i++) {
            for(let j=0; j<element.val.length;j++) {
              if (element.val[j] === fields[index].field_options.options[i].label) {
                if (typeof(fields[index].field_options.options[i].truechoice) !== 'undefined') {
                  if (fields[index].field_options.options[i].truechoice) { // cevap dogru ise
                    element.result[j] = true;
                  }else { // cevap yanlis ise
                    element.result[j] = false;
                  }
                }else { // dogru-yanlsi degeri yoksa default olarak yanlis sayiyoruz
                  element.result[j] = false;
                }
              }
            }
          }
        }
      });

      //console.log(response);
      const response_id = Responses.insert({ fields: response });
      return response_id;
    }else { // eger islenecek form survey ise
      //console.log(response);
      const response_id = Responses.insert({ fields: response });
      return response_id;
    }
  },

  // for preview purpose only
  add_video_to_preview(q_id, user_id, video_id) {
    const already_exists = PreviewVideos.findOne({ $and : [{ question: q_id}, {user: user_id}]});
    if (already_exists) {
      Videos.remove(already_exists.video); // remove the previous video
      PreviewVideos.update({ $and : [{ question: q_id}, {user: user_id}]}, {
        $set: { video: video_id } // set the new one
      });
      return already_exists._id;
    }else { // if there is no record before, then create a new one
      const preview_id = PreviewVideos.insert({
        question: q_id,
        user: user_id,
        video: video_id
      });
      return preview_id;
    }
  },



  save_form_response_preview(form_id, response_id) {
    const user_id = Meteor.userId();
    const already_exists = FormResponses.findOne({ $and : [{ form: form_id}, {user: user_id}]});
    if (already_exists) {
      Responses.remove(already_exists.response); // remove the previous response
      FormResponses.update({ $and : [{ form: form_id}, {user: user_id}]}, {
        $set: { response: response_id } // set the new one
      });
      return already_exists._id;
    } else {
      const form_response_id = FormResponses.insert({
        form: form_id,
        user: user_id,
        response: response_id
      });
      return form_response_id;
    }
  },

});
