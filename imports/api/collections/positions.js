export const Positions = new Mongo.Collection('positions');

Positions.attachSchema(new SimpleSchema({
  title: { type: String, max: 256 },
  user: { type: String, max: 64},
  description: { type: String, max: 4096, optional: true},
  opensAt: { type: Date, optional: true },
  endsAt: { type: Date, optional: true },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) { return new Date(); }
      else if (this.isUpsert) { $setOnInsert: new Date(); }
      else { this.unset(); }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
}));
