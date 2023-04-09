const {Router}  = require ('express')
const products = require ('../routers/productRouter')
const carts = require ('../routers/cartRouter')

const router = Router()

router.use("/products", products)
router.use("/carts", carts)


module.exports = router