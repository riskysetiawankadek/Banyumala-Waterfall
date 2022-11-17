const express = require('express');
const router = express.Router();
const path = require('path')
/* GET Image from public folder*/
router.get('/:imgName', function (req, res, next) {
    var options = {
        root: path.join(__dirname)
    };
    res.sendFile(req.params.imgName,options);
});


module.exports = router;