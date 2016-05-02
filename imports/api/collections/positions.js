export const Positions = new Mongo.Collection('positions');

Positions.attachSchema(new SimpleSchema({
  title        : { type: String, max: 256 },
  user         : { type: String, max: 64},
  description  : { type: String, max: 4096, optional: true},
  opensAt      : { type: Date,   optional: true },
  endsAt       : { type: Date,   optional: true },

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

export const SingleProcesses = new Mongo.Collection('single_processes');

SingleProcesses.attachSchema(new SimpleSchema({
  related_to: { type: [String] },
  description: { type: String, max: 2018, optional: true },

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

export const RecruitmentProcesses = new Mongo.Collection('recruitment_processes');

RecruitmentProcesses.attachSchema(new SimpleSchema({
  position      : { type: String },
  user          : { type: String, max: 64},

  prerequisites : { type: String, optional: true },
  test          : { type: String, optional: true },
  survey        : { type: String, optional: true },
  pi            : { type: String, optional: true },
  keynote       : { type: String, optional: true },
  video         : { type: String, optional: true },

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
