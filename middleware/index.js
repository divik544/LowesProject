var Item=require("../models/items");
var Comment=require("../models/comment")

var middlewareObj={};

middlewareObj.checkItemownership=function(req,res,next){
     if(req.isAuthenticated()){
        
        
         Item.findById(req.params.id,function(err,foundItem){
        if(err || !foundItem)
        {
            req.flash("error","Item not found");
            res.render("back");
        }else
        {
            if(foundItem.author.id.equals(req.user._id)){
                
                next();     
            }
                
            else{
                req.flash("error","You dont have permission to do that");
                res.redirect("back");
            }
        }
        
    });
    }else{
        req.flash("error","You need to be logged in first");
        res.redirect("back");
        
    }
    
};

middlewareObj.checkCommentOwnership=function checkCommentOwnership(req,res,next){
     if(req.isAuthenticated()){
        
        
         Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err || !foundComment)
        {
            req.flash("error","Comment not found");
            res.render("back");
        }else
        {
            if(foundComment.author.id.equals(req.user._id)){
                next();     
            }
                
            else{
                req.flash("error","You dont have permission to do that");
                res.redirect("back");
            }
        }
        
    });
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
        
    }
    
};

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    
    req.flash("error", "You need to be logged in to do that");
    
    res.redirect("/login");
    
}

module.exports=middlewareObj;