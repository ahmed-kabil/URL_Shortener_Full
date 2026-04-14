const express = require("express")
const router = express.Router();
const controller = require("./controller.js")


router.route("/api/shorten")
     .post(controller.shortenLink)
     

router.route("/api/gencount")
     .get(controller.getgencount)

router.route("/api/redcount")
     .get(controller.getredcount)


router.route("/:text")
     .get(controller.redirectLink)



// router.route("/add")
//      .post(controller.createNewUser);


// router.route("/:id")
//      .get(controller.getUserById)
//      .delete(controller.deleteUserById)
//      .patch(controller.updateUser)


module.exports = router ;