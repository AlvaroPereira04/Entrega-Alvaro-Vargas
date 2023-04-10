const {Router}  = require ('express')
const products = require ('../routers/products.router.js')
const carts = require ('./cart.router')

const router = Router()

router.use("/products", products)
router.use("/carts", carts)


module.exports = router