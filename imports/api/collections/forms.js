export const Forms = new Mongo.Collection('forms');

export const FormResponses = new Mongo.Collection('form_responses');

FormResponses.attachSchema(new SimpleSchema({
  form: { type: String, max: 64 },
  user: { type: String, max: 64},
  response: { type: Object },
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
