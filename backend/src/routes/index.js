const { Router } = require("express")
const router = Router()
const {
  subscribe,
  cancel,
  getTransactions,
  getUsers,
  getFunds,
} = require("../controllers/indexController")

router.post("/subscribe", subscribe)
router.post("/cancel", cancel)
router.get("/getTransactions", getTransactions)
router.get("/getUsers", getUsers)
router.get("/getFunds", getFunds)

module.exports = router
