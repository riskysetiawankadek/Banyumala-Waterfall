const Users = require("../Models/userModel.js")
const errHandler =  require("../Helpers/error_helper.js")
const bcrypt = require('bcrypt');

// Create/update Users
const upsertUsers = async (req, res, next) => {
	try {
		let result = await Users.upsert(req.body, { where: { id: req.params.id } });
        result=JSON.parse(JSON.stringify(result[0]));
		res.app.locals.Users = result;
		res.app.locals.msg = "Success! Data has been saved";
	} catch (error) {
		res.status(500).json(errHandler(error));
	}
    next();
};




// GET all data Users
const getUsers = async (req, res, next) => {
	try {
		let result = await Users.findAll({order:[["id_user",'DESC']]});
		if(result == ""){
            res.app.locals.Users = {
                error: "no user exist"
            };
        }else{
            result=JSON.parse(JSON.stringify(result));
            res.app.locals.Users = result;
			
        }
        
	} catch (error) {
		res.status(500).json(error.message);
	}
    next();
};


//DELETE Users
const deleteUsersById = async (req, res,next) => {
	try {
		// check if the requested record exist, if exist delete
		const isExist = await Users.findOne({ where: { id_user: req.params.id } });
		if(isExist){
			const result = await Users.destroy({ where: { id_user: req.params.id } });
			if(result){
				res.app.locals.Users = {msg: "data berhasil dihapus"};
				res.app.locals.msg = "Success! Data has been deleted";
			}
		}else{
			res.app.locals.Users = {error: "Data tidak ada pada tabel"};
		}
	} catch (error) {
		res.app.locals.Users=JSON.parse(JSON.stringify(errHandler(error)));
	}
	next();
};

// update Members
const upsertMembers = async (req, res, next) => {
	try {
		console.log(req.body);
		let result = await Users.upsert(req.body, { where: { id: req.params.id } }).catch(function(err) {
			// print the error details
			console.log(err, request.body.username);
		});
        result=JSON.parse(JSON.stringify(result[0]));
		res.app.locals.Users = result;
		res.app.locals.msg = "Success! Data has been saved";
	} catch (error) {
		res.app.locals.Users = {error: "Register Failed"};
		res.status(500).json(errHandler(error));
	}
    next();
};


// update Members
const createMembers = async (req, res, next) => {
	try {
		const isExist = await Users.findOne({ where: { username: req.body.username } });
		console.log(isExist);
		if(!isExist){
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			req.body.password = hashedPassword;
			req.body.id_role = 3;
			let result = await Users.upsert(req.body);
			result=JSON.parse(JSON.stringify(result[0]));
			res.app.locals.Users = result;
			res.app.locals.msg = "Success! Data has been saved";
		}
		else{
			console.log("tidak tersedia")
			res.app.locals.msg = "Username tidak tersedia";
		}
	} catch (error) {
		console.log(error);
		res.app.locals.Users = {error: "Register Failed"};
		res.app.locals.msg = "Username tidak tersedia";
		//res.status(500).json(errHandler(error));
	}
    next();
};

// GET all members. select all user where id role = 3 (member)
const getMembers = async (req, res, next) => {
	try {
		let result = await Users.findAll({
			order:[["id_user",'DESC']],
			where: { id_role: 3 }
		});
		if(result == ""){
            res.app.locals.Members = {
                error: "no user exist"
            };
        }else{
            result=JSON.parse(JSON.stringify(result));
            res.app.locals.Members = result;
			
        }
	} catch (error) {
		res.status(500).json(error.message);
	}
    next();
};

// GET all members. select all user where id role = 3 (member)
const getMemberbyID = async (req, res, next) => {
	try {
		let result = await Users.findOne({
			where: { id_role: 3, id_user:req.params.id }
		});
		if(result == ""){
            res.app.locals.Members = {
                error: "no user exist"
            };
        }else{
            result=JSON.parse(JSON.stringify(result));
            res.app.locals.Members = result;
			
        }
	} catch (error) {
		res.status(500).json(error.message);
	}
    next();
};

// upload profile image
const uploadFIle = async(req,res,next)=>{
    try {
        console.log(res.app.locals.Users)
        if(!req.files || res.app.locals.msg === "Username tidak tersedia") {
            next();
        } 
        else {
            let profileImg = req.files.profileImg;
            let imgFormat = profileImg.name;
            imgFormat = imgFormat.split(".").pop();
            let imgName = "user"+Number(res.app.locals.Users.id_user)+"."+imgFormat;
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            profileImg.mv('./uploads/' + imgName);
            Users.update({photo : imgName},{where: {username : res.app.locals.Users.username}})
            next()
        }
    } catch (err) {
        
    }
}

module.exports = {
    upsertUsers,
    deleteUsersById,
    getUsers,

	upsertMembers,
	getMembers,
	createMembers,
	getMemberbyID,
	uploadFIle
}