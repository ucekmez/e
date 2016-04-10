export const Keynotes = new Mongo.Collection('keynotes');

Keynotes.attachSchema(new SimpleSchema({
  title: { type: String, max: 256},
  user: { type: String, max: 64},
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
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
}));

export const Slides = new Mongo.Collection('slides');
