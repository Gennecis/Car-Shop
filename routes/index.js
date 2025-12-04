const router = require("express").Router();

router.use("/", require("./swagger"));

router.get("/", (req, res) => (
    // #swagger.tags=["Hello World"]
    res.send("Hello world")));

router.use("/users", require("./users"));
router.use("/cars", require("./cars"));
router.use("/stores", require("./stores"));

module.exports = router;