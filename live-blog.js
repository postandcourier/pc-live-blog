Posts = new Mongo.Collection("posts");
Keys = new Mongo.Collection("keys");

Accounts.config({
  forbidClientAccountCreation : false
});

if (Meteor.isClient) {
  
  Meteor.subscribe("posts");
  Meteor.subscribe("keys");

  Template.main.helpers({
    posts: function () {
      return Posts.find({}, {sort: {createdAt: -1}});
    },
    keys: function () {
      return Keys.find({}, {sort: {createdAt:-1}});
    }
  });
  
  
  Template.main.events({
    "submit .new-post": function (event) {
      var text = "",
          content = "",
          chartData = "",
          yMax = "",
          dashNum = "",
      
      text = event.target.text.value;
      content = event.target.content.value;
      chartData = event.target.chartData.value;
      yMax = event.target.yMax.value;
      dashNum = event.target.dashNum.value;
      
      Meteor.call("addPost", text, content, chartData, yMax, dashNum);
      
      // Clear Form
      event.target.text.value = "";
      
      return false;
      
    }
  })
  
  Template.key.helpers({
    timeStamp: function() {
      var data = Keys.findOne({_id:this._id});
      if(data){
        return moment(data.createdAt).format("h:ma");
      }
    }
  })
  
  Template.post.events({
    "click .delete": function () {
      Posts.remove(this._id);
    }
  })
  
  Template.post.helpers({
    chartData: function() {
      var data = Posts.findOne({_id:this._id});
      if(data){
        return data.chartData;
      }
    },
    timeAgo: function() {
      var data = Posts.findOne({_id:this._id});
      if(data){
        return moment(data.createdAt).fromNow().replace(/ minutes/, "m").replace(/ minute/, "m");
      }
    }
  })
  
  Template.post.rendered = function() {    
    var nodeId = this.data._id;
    
    if (this.data.chartData) {
      
      
      
      var barChart = d3plus.viz()
        .type("bar")
        .id("Response")
        .background({color:"#fff", stroke:{color:"#fff",width:0}})
        .axes({background:{color:"#f6f6f6",stroke:{color:"#fff",width:0}}})
        .x({value:"Response", grid:false, ticks: {width:0}, label:false})
        .y({"range": [0,124],"lines":83, "value": "Value", "label": false, grid:{color:"#fff"}, ticks:{size:0}})
        .legend({value:true, size:[40,40]})
        .labels({value:true, align: "left"})
        .font({ "family": "Open Sans" })
        .color(function(d){
          if (d.Response == "Yes") {
            return "#2ECC40";
          } else if (d.Response == "No") {
            return "#FF851B";
          } else if (d.Response == "Aye") {
            return "#0074D9";
          } else if (d.Response == "Nay") {
            return "#FF4136";
          } else {
            return "#DDDDDD";
          }
        });
        
        contStr = '#node_'+this.data._id;
        barChart.container(contStr);
    }
    
    Deps.autorun(function (tracker) {
      var reactiveChart = Posts.findOne({_id:nodeId});
      var parsedData = JSON.parse(reactiveChart.chartData);
      
      if (barChart){
        barChart.y({lines:false})
        
        barChart.y({ "range": [0,reactiveChart.yMax],lines:{ value: reactiveChart.dashNum, dasharray: [5,5], width: 2 } })
        .data(parsedData)
        .draw();
      }
    })
  }
  
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
}

Meteor.methods({
  addPost: function(text, content, chartData, yMax, dashNum) {
    
    Posts.insert({
      text: text,
      content: content,
      chartData: chartData,
      yMax: yMax,
      dashNum: dashNum,
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
  
  Meteor.publish("keys", function() {
    return Keys.find();
  });
  
  Meteor.publish("posts", function() {
    return Posts.find();
  });
}
