import { Companies } from '/imports/api/collections/companies.js';

Meteor.methods({
  add_new_company(companyname, email, password){
    // yeni bir kullanici olusturuyoruz
    const user_id = Accounts.createUser({
      email: email,
      password: password,
    });
    // olusturdugumuz kullaniciya firma rolunu veriyoruz
    Roles.addUsersToRoles(user_id, ['company']);
    // yeni bir firma olusturuyoruz
    const company_id = Companies.insert({
      name: companyname,
    });
    // olusturdugumuz firmanin yetkilisi olacak kullaniciyi bagliyoruz
    Companies.update(company_id, { $set: {user: user_id, email: email}});
  },

  remove_company(id) {
    const company = Companies.findOne(id);
    Meteor.users.remove(company.user);
    Companies.remove(id);
  },


});
