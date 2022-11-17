
function checkAutinticated(req, res, next){
    //console.log(req.isAuthenticated())
    if(req.isAuthenticated()){
        console.log("authenticated")
        return next()
    }else{
        console.log("not auth")
        res.redirect(302,'/login/')
    }
    
}
function checkRoleMember( req, res, next){
    if(req.user.id_role == 3){
        if(req.params.id == req.user.id_user){
            console.log("role authenticated")
            return next()
        }
        console.log("not authenticated")
        console.log(`id user= ${req.user.id_user}`)
        console.log(`id role= ${req.user.id_role}`)
        return res.redirect(302,'/member/'+String(req.user.id_user))
    }
    else if(req.user.id_role == 2){
        return res.redirect(302,'/bumdes/')
    }
    else if(req.user.id_role == 1){
        return res.redirect(302,'/admin/')
    }
}
function checkRoleAdmin( req, res, next){
    
    if(req.user.id_role == 1){
        console.log("admin");
        return next()
    }
    else if(req.user.id_role == 2){
        console.log("not admin")
        return res.redirect(302,'/bumdes/')
    }
    else if(req.user.id_role == 3){
        console.log("not admin")
        return res.redirect(302,'/member/'+String(req.user.id_user))
    }
}
function checkRoleBumdes( req, res, next){
    if(req.user.id_role == 2){
        return next()
    }
    else if(req.user.id_role == 1){
        return res.redirect(302,'/member/'+String(req.user.id_user))
    }
    else if(req.user.id_role == 1){
        return res.redirect(302,'/admin/')
    }
}
module.exports = {
    checkAutinticated,
    checkRoleAdmin,
    checkRoleBumdes,
    checkRoleMember
}