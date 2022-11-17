const Categories = require("../Models/categoryModel.js")
const errHandler =  require("../Helpers/error_helper.js")

// Create/update Categories
const upsertCategories = async (req, res, next) => {
	try {
		let result = await Categories.upsert(req.body, { where: { id_category: req.body.id_category } });
        result=JSON.parse(JSON.stringify(result[0]));
		res.app.locals.Categories = result;
		res.app.locals.msg = "Success! Data has been saved";
	} catch (error) {
		res.app.locals.Categories=JSON.parse(JSON.stringify(errHandler(error)));
	}
    next();
};


// GET all data Categories
const getCategories = async (req, res, next) => {
	try {
		let result = await Categories.findAll({order:[["id_category",'DESC']]});
		if(result == ""){
            res.app.locals.Categories = {
                error: "no category exist"
            };
        }else{
            result=JSON.parse(JSON.stringify(result));
            res.app.locals.Categories = result;
			
        }
        
	} catch (error) {
		res.app.locals.Categories=JSON.parse(JSON.stringify(errHandler(error)));
	}
    next();
};

//DELETE Categories
const deleteCategoriesById = async (req, res,next) => {
	try {
		// check if the requested record exist, if exist delete
		const isExist = await Categories.findOne({ where: { id_category: req.params.id } });
		if(isExist){
			const result = await Categories.destroy({ where: { id_category: req.params.id } });
			if(result){
				res.app.locals.Categories = {msg: "data berhasil dihapus"};
				res.app.locals.msg = "Success! Data has been deleted";
			}
		}else{
			res.app.locals.Categories = {error: "Data tidak ada pada tabel"};
		}
	} catch (error) {
		res.app.locals.Categories=JSON.parse(JSON.stringify(errHandler(error)));
	}
	next();
};

module.exports = {
    upsertCategories,
    deleteCategoriesById,
    getCategories
}