export const InterviewQuestions = new Mongo.Collection('interviewquestions');

InterviewQuestions.attachSchema(new SimpleSchema({
  content: { type: String, max: 256 },
  description: { type: String, max: 256, optional: true },
  user: { type: String, max: 64},
  time: {type: Number, min: 0, max: 120},
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


/////////////

export const Videos = new FS.Collection("videos", {
  stores: [new FS.Store.GridFS("videos", {})]
});

/////////////

// for company preview
export const PreviewVideos = new Mongo.Collection('preview_videos');








//
