var mongoose = require("mongoose");
var Item = require("./models/items");
var Comment   = require("./models/comment");
 
 
function seedDB(){
   //Remove all items
   Item.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed items!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
        });
    }); 
}
 
module.exports = seedDB;