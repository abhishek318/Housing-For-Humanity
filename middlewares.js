var $ = module.exports;

$.authenticatedOnly = function(req,res,next){
  if(req.isAuthenticated()){
    next();
  }else{
  	res.render("error", {
  		error : "Unautherized",
  		message : "Login First.It is "	
  	});
    res.redirect("/login");
  }
}
