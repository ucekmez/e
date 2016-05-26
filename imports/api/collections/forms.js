export const Forms = new Mongo.Collection('forms');

Forms.attachSchema(new SimpleSchema({
  title: { type: String, max: 128 },
  user: { type: String, max: 64},
  type: { type: String, max:32 },
  payload: {type: String, max:16384, optional: true},
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


// tum cevaplar burada tutulacak
export const Responses = new Mongo.Collection('responses');


export const FormResponses = new Mongo.Collection('form_responses');

FormResponses.attachSchema(new SimpleSchema({
  form: { type: String, max: 64 },
  user: { type: String, max: 64},
  user_name: { type: String, max: 64, optional: true },
  email: { type: String, max: 128 },
  response: { type: String, max: 64 },
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


//////////////////// predefined tests

export const PredefinedLanguageQuestions = new Mongo.Collection('predefined_language_questions');
export const PredefinedTechnicalQuestions = new Mongo.Collection('predefined_technical_questions');


export const PredefinedLanguageTemplates = new Mongo.Collection('predefined_language_templates');
PredefinedLanguageTemplates.attachSchema(new SimpleSchema({
  title: { type: String, max: 128 },
  user: { type: String, max: 64},
  language: { type: String, max: 32},
  level: { type: String, max: 32},
  numquestions: { type: Number, min: 1 },

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

export const PredefinedTechnicalTemplates = new Mongo.Collection('predefined_technical_templates');
PredefinedTechnicalTemplates.attachSchema(new SimpleSchema({
  title: { type: String, max: 128 },
  user: { type: String, max: 64},
  level: { type: String, max: 32},
  sector: { type: String, max: 32},
  numquestions: { type: Number, min: 1 },

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

export const PredefinedLanguageTestResponses = new Mongo.Collection('predefined_language_test_responses');
export const PredefinedTechnicalTestResponses = new Mongo.Collection('predefined_technical_test_responses');



//
