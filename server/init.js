import { Accounts } from 'meteor/accounts-base';

Meteor.startup(function(){
  if (Meteor.users.find().count() === 0) {
    // group : kullanicilar sadece gruplarinin icerisindeki
    // iceriklerde sahip olduklari rolleri kullanabilirler
    var users = [
      {
        name: "Ugur Cekmez",
        username: "ugur",
        email: "a@f.com",
        roles: ['admin'],
        //group: 'admin'
      }
    ];

    users.forEach(function(user) {
      var id;
      // Kullanici olusturuyoruz
      id = Accounts.createUser({
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
