const router = require("express").Router();
const controller = require("../controller/user.controller");
const {
  authorityCheckGet,
  authorityCheckPost,
} = require("../controller/authority.controller");

// router.get("/owned", authorityCheckGet, controller.myPageOwned);
// router.get("/selling", authorityCheckGet, controller.myPageSelling);
// router.post("/joinMembership", controller.joinMembership);
// router.post("/login", controller.login);
// router.put("/tokenApprove", authorityCheckPost, controller.tokenApprove);
// router.get("/selled", authorityCheckGet, controller.myPageSelled);
// router.get("/used", authorityCheckGet, controller.myPageUsed);
// router.get("/approve", controller.approve);
// router.get("/logout", controller.logout);

router.get("/owned", controller.myPageOwned);
router.get("/selling", controller.myPageSelling);
router.post("/joinMembership", controller.joinMembership);
router.post("/login", controller.login);
router.put("/tokenApprove", controller.tokenApprove);
router.get("/selled", controller.myPageSelled);
router.get("/used", controller.myPageUsed);
router.get("/approve", controller.approve);
router.get("/logout", controller.logout);

module.exports = router;
