var express=require("express");
var router=express.Router({mergeParams: true});


var Item=require("../models/items");
var middleware=require("../middleware");

router.get("/", function(req, res){
    
    Item.find({},function(err,allItems)
    {if(err)
    {
        console.log(err);
    }
    else
    {
         res.render("items/index",{items:allItems,currentUser:req.user,page: 'items'});
    }
        
    });
});

router.post("/",middleware.isLoggedIn, function(req, res){
   
    var name = req.body.name;
    var image = req.body.image;
    var price=req.body.price;
    var description=req.body.description;
    var author={
      id:req.user._id,
      username:req.user.username
    };
    var newItem = {name: name,price:price ,image: image, description:description,author:author};
   Item.create(newItem,function(err,newlyCreated)
   {
    if(err)
    {
        console.log(err);
    }
    else
    {
         res.redirect("/items");
    }   
       
   });
    //redirect back to items page
   
});

router.get("/new",middleware.isLoggedIn, function(req, res){
   res.render("items/new"); 
});

router.get("/:id",function(req, res) {
    Item.findById(req.params.id).populate("comments").exec(function(err,foundItem){
        if(err || !foundItem)
        {
            req.flash("error","Item not found");
            res.redirect("back");
            
        }
        else{
            console.log(foundItem);
            res.render("items/show",{item:foundItem});
        }
    });
});

router.get("/:id/edit",middleware.checkItemownership,function(req, res) {
    
    
        
        
         Item.findById(req.params.id,function(err,foundItem){
        res.render("items/edit",{item:foundItem});
       
        
    });

    
});

router.put("/:id",middleware.checkItemownership,function(req,res){
   Item.findByIdAndUpdate(req.params.id,req.body.item,function(err,updatedItem){
       if(err)
       {
           res.redirect("/items");
       }else{
           res.redirect("/items/"+req.params.id);
       }
       
   }) ;
    
});

router.delete("/:id",middleware.checkItemownership,function(req,res){
    Item.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/items");
           
       } else{
            res.redirect("/items");
       }
        
    });
    
});






module.exports=router;