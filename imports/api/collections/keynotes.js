export const Keynotes = new Mongo.Collection('keynotes');

Keynotes.attachSchema(new SimpleSchema({
  title: { type: String, max: 256},
  user: { type: String, max: 64},
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

export const Slides = new Mongo.Collection('slides');

Slides.attachSchema(new SimpleSchema({
  content: { type: String, max: 16384, optional: true},
  order: { type: Number, min: 0},
  keynote: { type: String, max: 64},
  user: { type: String, max: 64},
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


// ----- for statistics purpose

export const KeynoteResponses = new Mongo.Collection('keynote_responses');

KeynoteResponses.attachSchema(new SimpleSchema({
  keynote: { type: String, max: 64}, // related keynote id
  user: { type: String, max: 64}, // who entered
  user_name: { type: String, max: 64, optional: true },
  email: { type: String, max: 128 },
  times : { type: Number, min: 0, optional: true},
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
