import { Positions, Applications, RecruitmentProcesses } from '/imports/api/collections/positions.js';


Meteor.methods({
  add_response_to_application(application_id, type, response_id) {
    const app = Applications.findOne(application_id);
    // burada eger kullanici bir defa submit etmisse bir formu, bu durumda app.xxx kismi undefined olmayacak
    // dolayisiyla kullanici bir daha uzerine guncelleme yapamayacak
    if(type === "prerequisites" && typeof(app.prerequisites_responses) === 'undefined') {
      Applications.update({ _id: application_id }, { $addToSet: { prerequisites_responses: response_id }});

    }else if(type === "test" && typeof(app.test_responses) === 'undefined') {
      Applications.update({ _id: application_id }, { $addToSet: { test_responses: response_id }});

    }else if(type === "survey" && typeof(app.survey_responses) === 'undefined') {
      Applications.update({ _id: application_id }, { $addToSet: { survey_responses: response_id }});

    }else if(type === "pi" && typeof(app.pi_responses) === 'undefined') {
      Applications.update({ _id: application_id }, { $addToSet: { pi_responses: response_id }});

    }else if(type === "keynote" && typeof(app.keynote_responses) === 'undefined') {
      Applications.update({ _id: application_id }, { $addToSet: { keynote_responses: response_id }});

    }else if(type === "video" && typeof(app.video_responses) === 'undefined') {
      Applications.update({ _id: application_id }, { $addToSet: { video_responses: response_id }});
    }else {
      // bu durumda kullanici zaten formu doldurmustur, bir daha guncelleyemez
    }
  },

  add_position_to_user_profile(position_id){
    const already_exists = Applications.findOne({ $and : [{ user: Meteor.userId()}, {position: position_id}]});

    if (already_exists) {
      // Buraya girerse, bu kullanici daha once bu pozisyona basvurmus demektir
      console.log("Bu kullanici icin hali hazirda bir application baslatilmis");
      return already_exists._id;
    }
    const position = Positions.findOne(position_id);
    if (position) {
      const user = Meteor.user();
      let user_name = "";
      if (user.profile && user.profile.name) {
        user_name = user.profile.name;
      }
      let user_email = "";
      if (user.emails) {
        user_email = user.emails[0].address;
      }

      const new_application = Applications.insert({
        position: position_id,
        user: Meteor.userId(),
        deneme: "asd",
        position_title: position.title,
        user_name: user_name,
        email: user_email
      });
      console.log("Bu kullanici icin yeni bir application olusturuldu..");
      return new_application._id;
    }
  },

  find_next_step(type, rec_process_id, application_id) {
    const recruitment_process = RecruitmentProcesses.findOne(rec_process_id);
    const application = Applications.findOne(application_id);

    if (recruitment_process) {
      if (type === "apply") {
        if (typeof(recruitment_process.prerequisites) != 'undefined' && typeof(application.prerequisites_responses) == 'undefined') {
          return "prerequisites";
        }else if (typeof(recruitment_process.survey) != 'undefined' && typeof(application.survey_responses) == 'undefined') {
          return "survey";
        }else if (typeof(recruitment_process.test) != 'undefined' && typeof(application.test_responses) == 'undefined') {
          return "test";
        }else if (typeof(recruitment_process.pi) != 'undefined' && typeof(application.pi_responses) == 'undefined') {
          return "pi";
        }else if (typeof(recruitment_process.keynote) != 'undefined' && typeof(application.keynote_responses) == 'undefined') {
          return "keynote";
        }else if (typeof(recruitment_process.video) != 'undefined' && typeof(application.video_responses) == 'undefined') {
          return "video";
        }else {
          return "none"; // bu rec process icin hicbir step secilmemis demektir
        }
      }else if(type === "S1") {
        if (typeof(recruitment_process.survey) != 'undefined') {
          return "survey";
        }else if (typeof(recruitment_process.test) != 'undefined') {
          return "test";
        }else if (typeof(recruitment_process.pi) != 'undefined') {
          return "pi";
        }else if (typeof(recruitment_process.keynote) != 'undefined') {
          return "keynote";
        }else if (typeof(recruitment_process.video) != 'undefined') {
          return "video";
        }else {
          return "none"; // bu rec process icin hicbir step secilmemis demektir
        }
      }else if(type === "S2") {
        if (typeof(recruitment_process.test) != 'undefined') {
          return "test";
        }else if (typeof(recruitment_process.pi) != 'undefined') {
          return "pi";
        }else if (typeof(recruitment_process.keynote) != 'undefined') {
          return "keynote";
        }else if (typeof(recruitment_process.video) != 'undefined') {
          return "video";
        }else {
          return "none"; // bu rec process icin hicbir step secilmemis demektir
        }
      }else if(type === "S3") {
        if (typeof(recruitment_process.pi) != 'undefined') {
          return "pi";
        }else if (typeof(recruitment_process.keynote) != 'undefined') {
          return "keynote";
        }else if (typeof(recruitment_process.video) != 'undefined') {
          return "video";
        }else {
          return "none"; // bu rec process icin hicbir step secilmemis demektir
        }
      }else if(type === "S4") {
        if (typeof(recruitment_process.keynote) != 'undefined') {
          return "keynote";
        }else if (typeof(recruitment_process.video) != 'undefined') {
          return "video";
        }else {
          return "none"; // bu rec process icin hicbir step secilmemis demektir
        }
      }else if(type === "S5") {
        if (typeof(recruitment_process.video) != 'undefined') {
          return "video";
        }else {
          return "none"; // bu rec process icin hicbir step secilmemis demektir
        }
      }
    }else {
      return "no_process"; // burada da herhangi bir process tanimlanmadiysa gelecek bir hata kodu var
    }
  }

});
