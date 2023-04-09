const fs = require('fs')

class CartManager {
    constructor(archivo) {
        this.archivo = archivo;
    }

    exists(archivo) {
        /* verifico si existe el archivo */
        try {
            if (!fs.existsSync(archivo)) {
                throw new Error("The file does not exists");
            } else {
                return true;
            }
        } catch (error) {
            console.log(`Error looking for the file: ${error.message}`);
        }
    }

    readFile = async (archivo) => {
        try {
            /* leo el archivo */
            const data = await fs.promises.readFile(archivo);
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error reading the file: ${error.message}`)
        }
    }

    writeFile = async data => {
        try {
            await fs.promises.writeFile(
                this.archivo, JSON.stringify(data, null, 2)
                )
            }catch(err) {
            console.log(err);
            }
        }

    createCart = async () => {
        try {
        /* busco si el archivo no existe o si existe, si tiene datos*/
            if (!this.exists(this.archivo)) {
                /* Si el archivo no existe, lo creo con el primer carrito agregado */
                let cartsArray = []
                const cart = {
                    id: this.#idGen(),
                    products: [],
                };
                cartsArray.push(cart)
                await this.writeFile(cartsArray)
                console.log(`The cart was added with the id: ${cart.id}`)
                return cart.id
            } else {
                /* si el archivo existe, primero verifico si esta vacio */
                if (this.readFile(this.archivo)) {
                const cartsArray = await this.readFile(this.archivo)
                // const cartsArray = await this.getProducts()
                if (cartsArray.length === 0 || !cartsArray) {
                    /* si esta vacio no le paso parametro al idGenerator, por lo que le pondra id: 1 */
                    const cart = {
                        id: this.#idGen(),
                        products: [],
                    };
                    cartsArray.push(cart);
                } else {
                    /* si ya tiene algun producto, le paso el array de productos como parametro al idGenerator para que le ponga el id correspondiente */
                    const cart = {
                        id: this.#idGen(cartsArray),
                        products: [],
                    };
                    cartsArray.push(cart);
                }
                /* escribo el producto */
                await this.writeFile(cartsArray);
                console.log(`The cart was added with the id: ${cart.id}`);
                return carts;
            }
        }
        } catch (error) {
        console.log(`Error adding product: ${error.message}`);
        }
    }

    getCartById = async id => {
        try {
            if(this.exists(this.archivo)){
                let carts = await this.readFile(this.archivo)
                const cart = carts.find(item => item.id === id)
                return cart ? cart : console.log('No product found')
        }
        return console.log('The db not exist')
        } catch (error) {
            console.log(error);
        }
    }

    addToCart = async (cid, pid) => {
        try {
            if(this.exists(this.archivo)) {
                const carts = await this.readFile(this.archivo)
                const cart = carts.find(item => item.id === cid)
                console.log(cart);
            if(cart) {
                const addProduct = cart.products.find(item => item.id === pid)
                if(addProduct) {
                    addProduct.quantity++
                }else{
                    cart.products.push({id: pid, quantity: 1 })
                }
                await this.writeFile(carts)
                return cart
            }
            throw new Error(`The cart with the id was not found: ${cid}`)
        }
        } catch (error) {
            console.log(error);
        }
    }

    #idGen(productsArray = []) {
        const id =
        productsArray.length === 0
            ? 1
            : productsArray[productsArray.length - 1].id + 1;
        return id;
    }
}

module.exports = CartManager

  
