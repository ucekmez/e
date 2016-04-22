///////// kisilik envanteri
export const PIs = new Mongo.Collection('pis');
export const PIGroups = new Mongo.Collection('pi_groups');

PIGroups.attachSchema(new SimpleSchema({
  name: { type: String, max: 256},
  user: { type: String, max: 64},
  type: { type: String, max: 16},
  scales: { type: [String] },
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
