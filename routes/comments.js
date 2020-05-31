var express=require("express");
var router=express.Router({mergeParams: true});
var Item=require("../models/items");
var Comment=require("../models/comment");
var middleware=require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req, res) {
    
    Item.findById(req.params.id,function(err,item){
       if(err) 
       {
           
          console.log(err);
       }else
       {
            res.render("comments/new",{item:item});
       }
    });
   
});

router.post("/",middleware.isLoggedIn,function(req,res){
   Item.findById(req.params.id,function(err, item) {
      if(err)
      {
          console.log(err);
          res.redirect("/items");
      }else
      {
          Comment.create(req.body.comment,function(error,comment){
              if(error)
              {
                  console.log(error);
              }else{
                  
                  comment.author.id=req.user._id;
                  comment.author.username=req.user.username;
                  comment.save();
                  item.comments.push(comment);
                  item.save();
                  if(req.xhr)
                  {
                      res.json(comment);
                  }else
                  {
                  res.redirect("/items/"+item._id);}
              }
              
          });
      }
       
   });
    
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    
    Item.findById(req.params.id,function(err,foundItem){
       if(err || !foundItem)
       {
           req.flash("error","No item found");
           return res.redirect("back");
           
       }
          Comment.findById(req.params.comment_id,function(err, foundComment) {
       if(err){
           res.redirect("back");
       } else{
              res.render("comments/edit",{item_id:req.params.id,comment:foundComment}); 

       }
    });
    });
  
    
});

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/items/"+req.params.id);
       }
       
   }) ;
    
});

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err){
           res.redirect("back");
       } else{
           req.flash("success","Comment deleted");
           res.redirect("/items/"+req.params.id);
       }
        
    });
})







module.exports=router;