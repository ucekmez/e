import { Accounts } from 'meteor/accounts-base';
import { PIs } from '/imports/api/collections/pis.js'; // Personal Inventory collections

import  shortid  from 'shortid';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    // group : kullanicilar sadece gruplarinin icerisindeki
    // iceriklerde sahip olduklari rolleri kullanabilirler
    const users = [
      {
        name: "Ugur Cekmez",
        username: "ugur",
        email: "a@f.com",
        roles: ['admin'],
        //group: 'admin'
      }
    ];

    users.forEach(function(user) {
      // Kullanici olusturuyoruz
      const id = Accounts.createUser({
        email: user.email,
        username: user.username,
        password: "asdasd",
        profile: { name: user.name },
      });

      if (user.roles.length > 0) {
        Roles.addUsersToRoles(id, user.roles);
      }

      console.log("User " + user.name + " added in role " + user.role);
    });

  }
  
});
