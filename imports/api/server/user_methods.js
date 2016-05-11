import { Positions, Applications, RecruitmentProcesses } from '/imports/api/collections/positions.js';


Meteor.methods({
  add_position_to_user_profile(position_id){
    const already_exists = Applications.findOne({ $and : [{ user: Meteor.userId()}, {position: position_id}]});

    if (already_exists) {
      // Buraya girerse, bu kullanici daha once bu pozisyona basvurmus demektir
      console.log("Bu kullanici icin hali hazirda bir application baslatilmis");
      return already_exists._id;
    }
    const new_application = Applications.insert({
      position: position_id,
      user: Meteor.userId()
    });

    console.log("Bu kullanici icin yeni bir application olusturuldu");
    return new_application._id;
  },

  find_next_step(type, rec_process_id) {
    const recruitment_process = RecruitmentProcesses.findOne(rec_process_id);
    if (recruitment_process) {
      if (type === "apply") {
        if (typeof(recruitment_process.prerequisites) != 'undefined') {
          return "prerequisites";
        }else if (typeof(recruitment_process.survey) != 'undefined') {
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
