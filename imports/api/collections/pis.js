///////// kisilik envanteri
export const PIs = new Mongo.Collection('pis');

export const PIGroups = new Mongo.Collection('pi_groups');

PIGroups.attachSchema(new SimpleSchema({
  name: { type: String, max: 256},
  user: { type: String, max: 64},
  type: { type: String, max: 16},
  sector: { type: String, max: 32, optional: true},
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


export const PIResponses = new Mongo.Collection('pi_responses');
PIResponses.attachSchema(new SimpleSchema({
  group: { type: String, max: 64 }, // PIGroup ID
  user: { type: String, max: 64},
  user_name: { type: String, max: 64, optional: true },
  email: { type: String, max: 128 },
  response: { type: String, max: 4096 }, // will be the stringified version of JSON response
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








//
