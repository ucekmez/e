
// generic events

f_add_new_form = function(event, instance) {
  Meteor.call('add_new_form', function(err, data) {
    if (err) {
      toastr.error('Form cannot be created. Please review it!');
    }else {
      FlowRouter.go("edit_form", {formId: data});
    }
  });
};

f_add_new_test = function(event, instance) {
  Meteor.call('add_new_test', function(err, data) {
    if (err) {
      toastr.error('Form cannot be created. Please review it!');
    }else {
      FlowRouter.go("edit_form", {formId: data});
    }
  });
};


f_add_new_prerequisite = function(event, instance) {
  Meteor.call('add_new_prerequisite', function(err, data) {
    if (err) {
      toastr.error('Form cannot be created. Please review it!');
    }else {
      FlowRouter.go("edit_form", {formId: data});
    }
  });
};

f_add_new_keynote = function(event, instance) {
  Meteor.call('add_new_keynote', function(err, data) {
    if (err) {
      toastr.error('Keynote cannot be created. Please review it!');
    }else {
      Meteor.call('add_new_slide', data, function(err2, data2) {
        if (err2) {
          toastr.error('Slide cannot be created. Please review it!');
        }else {
          FlowRouter.go("edit_keynote", {keynoteId: data});
        }
      });
    }
  });
};

f_add_new_position = function(event, instance) {
  $('.modal.add-new-position')
    .modal({
      //blurring: true,
      onDeny() {
        $('.ui.form').form('reset');
        $('.ui.form').form('clear');
        Session.set("position-success", false);
      },
      onApprove() {
        $('.ui.form')
          .form({
            fields: {
              positiontitle   : 'empty',
              opensat         : 'empty',
              endsat          : 'empty',
              description     : 'empty',
            }
          });

        if ($('.ui.form').form('is valid')) {
          const positiontitle = $('#positiontitle').val();
          const opensat = $('#opensat').val();
          const endsat = $('#endsat').val();
          const description = $('.fr-element.fr-view').html();
          Meteor.call('add_new_position', positiontitle, opensat, endsat, description, function (err, data) {
            if (err) {
              toastr.error(err.reason);
              Session.set("position-success", false);
            }else {
              Session.set("position-success", false);
              $(".ui.form").form('reset');
              $(".ui.form").form('clear');
              toastr.success('New Position has been added!');
              $('.modal.add-new-position').modal('hide');
              FlowRouter.go('list_positions');
            }
          });

          if (!Session.get("position-success")) {
            Session.set("position-success", false);
            return false;
          }
        }else {
          toastr.error('Please correct the errors!');
          return false;
        }
      }
    })
    .modal('show');
};

f_add_new_question = function(event, instance) {
  $('.modal.add-new-question')
    .modal({
      //blurring: true,
      onDeny() {
        $('.ui.form').form('reset');
        $('.ui.form').form('clear');
        Session.set("question-success", false);
      },
      onApprove() {
        $('.ui.form')
          .form({
            fields: {
              question      : 'empty',
              responsetime  : 'empty',
            }
          });

        if ($('.ui.form').form('is valid')) {
          const question = $('#question').val();
          const description = $('#description').val();
          const responsetime = $('#responsetime').val();
          Meteor.call('add_new_interview_question', question, description, responsetime, function (err, data) {
            if (err) {
              toastr.error(err.reason);
              Session.set("question-success", false);
            }else {
              Session.set("question-success", false);
              $(".ui.form").form('reset');
              $(".ui.form").form('clear');
              toastr.success('New Question has been added!');
              $('.modal.add-new-question').modal('hide');
              FlowRouter.go('list_questions');
            }
          });

          if (!Session.get("question-success")) {
            Session.set("question-success", false);
            return false;
          }
        }else {
          toastr.error('Please correct the errors!');
          return false;
        }
      }
    })
    .modal('show');
};
