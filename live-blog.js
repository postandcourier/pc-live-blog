Posts = new Mongo.Collection("posts");

Posts.attachSchema(new SimpleSchema({
  text: {
    type: String,
    label: "text"
  },
  content: {
    type: String,
    label: "content"
  }
}));

Accounts.config({
  forbidClientAccountCreation : false
});

if (Meteor.isClient) {
  
  Meteor.subscribe("posts");

  Template.main.helpers({
    posts: function () {
      return Posts.find({}, {sort: {createdAt: -1}});
    }
  });
  
  Template.main.events({
    "submit .new-post": function (event) {
      var text = event.target.text.value,
          content = event.target.content.value,
          chartData = event.target.chartData.value;
      
      Meteor.call("addPost", text, content, chartData);
      
      // Clear Form
      event.target.text.value = "";
      
      return false;
      
    }
  })
  
  Template.post.events({
    "click .delete": function () {
      Posts.remove(this._id);
    }
  })
  
  Template.post.rendered = function() {
    console.log(data);
    
    
  }
  
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
}

Meteor.methods({
  addPost: function(text, content, chartData) {
    if (! Meteor.userId() ) {
      throw new Meteor.Error("not-authorized");
    }
    
    Posts.insert({
      text: text,
      content: content,
      chartData: chartData,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deletePost: function (postId) {
    Posts.remove(postId);
  },
  editPost: function (postId, chartData) {
    
  }
})

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  
  Meteor.publish("posts", function() {
    return Posts.find();
  });
}
