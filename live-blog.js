Posts = new Mongo.Collection("posts");

Accounts.config({
  forbidClientAccountCreation : true
});

if (Meteor.isClient) {

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
      
      Posts.insert({
        text: text,
        content: content,
        chartData: chartData,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
      });
      
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

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
