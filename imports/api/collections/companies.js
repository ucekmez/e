export const Companies = new Mongo.Collection('companies');

Companies.attachSchema(new SimpleSchema({
  name: { type: String, max: 256 },
  user: { type: String, optional: true },
  email: { type: String, optional: true },
  createdAt : {
    type: Date,
    autoValue: function() {
      if (this.isInsert) { return new Date(); }
      else if (this.isUpsert) { $setOnInsert: new Date(); }
      else { this.unset(); }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() { if (this.isUpdate) { return new Date(); } },
    denyInsert: true,
    optional: true
  }
}));

Companies.allow({
  insert: function (userId, doc) {
    if (userId && Roles.userIsInRole(userId, ['admin'])) {
      return true;
    }
  },
  update: function (userId, doc, fields, modifier) {
    // burayi yalnizca oturum acan VE admin degistirebilir
    if (userId && Roles.userIsInRole(userId, ['admin'])) {
      return true;
    }
  },
  // burayi sadece oturum acan ve admin degistirebilir
  remove: function (userId, doc, fields, modifier) {
    if (userId && Roles.userIsInRole(userId, ['admin'])) {
      return true;
    }
  }
});
