const express = require('express');
const app = express();
const port = 8080;
app.use(express.json());

const productosFilePath = './productos.json';
const carritoFilePath = './carrito.json';


// Middleware para el manejo de JSON en el body de las requests
app.use(express.json());

// Configuración de las rutas para el manejo de productos
const productsRouter = express.Router();

// GET /api/products
productsRouter.get('/', (req, res) => {
  // lógica para obtener los productos de la base de datos
  // y responder con una lista de los productos
  // leer los productos desde el archivo productos.json
  fs.readFile('./productos.json', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al leer los productos');
    } else {
      let productos = JSON.parse(data);
      // aplicar el límite especificado por el query param limit
      if (req.query.limit) {
        productos = productos.slice(0, req.query.limit);
      }
      res.json(productos);
    }
  });
});

// GET /api/products/:pid
productsRouter.get('/:pid', (req, res) => {
  // lógica para obtener el producto con el id :pid de la base de datos
  // y responder con el producto correspondiente
  // leer los productos desde el archivo productos.json
  fs.readFile('./productos.json', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const productos = JSON.parse(data);
      const producto = productos.find((p) => p.id == req.params.pid);
      if (producto) {
        res.json(producto);
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

// POST /api/products
productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  // Aquí iría la lógica para agregar el nuevo producto a la base de datos
  // y responder con el producto agregado
  // leer los productos desde el archivo productos.json
  fs.readFile('./productos.json', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const productos = JSON.parse(data);
      // generar un nuevo id para el producto
      const newId = productos.length + 1;
      const newProduct = {
        id: newId,
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status || true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || [],
      };
      // validar que se proporcionen todos los campos obligatorios
      if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
        res.status(400).send('Faltan campos obligatorios');
      } else {
        productos.push(newProduct);
        // guardar los productos actualizados en el archivo productos.json
        fs.writeFile('./productos.json', JSON.stringify(productos), (err) => {
          if (err) {
            console.log(err);
            res.status(500).send('Error al guardar el producto');
          } else {
            res.json(newProduct);
          }
        });
      }
    }
});

// PUT /api/products/:pid
productsRouter.put('/:pid', (req, res) => {
  const updatedProduct = req.body;
  // Aquí iría la lógica para actualizar el producto con el id :pid en la base de datos
  // y responder con el producto actualizado
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  const productIndex = products.findIndex(p => p.id == req.params.pid);
  if (productIndex >= 0) {
    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      id: req.params.pid // aseguramos que el id no cambie
    };
    products[productIndex] = updatedProduct;
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
    res.json(updatedProduct);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// DELETE /api/products/:pid
productsRouter.delete('/:pid', (req, res) => {
  // Aquí iría la lógica para eliminar el producto con el id :pid de la base de datos
  // y responder con un mensaje de éxito
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  const productIndex = products.findIndex(p => p.id == req.params.pid);
  if (productIndex >= 0) {
    products.splice(productIndex, 1);
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
    res.send('Producto eliminado');
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Agregar el router de productos a la aplicación principal
app.use('/api/products', productsRouter);

// Función para generar un ID único
function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // Ruta para crear un nuevo carrito
  app.post('/api/carts/', (req, res) => {
    const carrito = {
      id: generateId(),
      products: []
    };
  
    fs.writeFile(carritoFilePath, JSON.stringify(carrito), (err) => {
      if (err) throw err;
      res.status(201).json(carrito);
    });
  });
  
  // Ruta para listar los productos de un carrito
  app.get('/api/carts/:cid', (req, res) => {
    const cid = req.params.cid;
  
    fs.readFile(carritoFilePath, (err, data) => {
      if (err) throw err;
      const carrito = JSON.parse(data);
  
      if (carrito.id === cid) {
        res.json(carrito.products);
      } else {
        res.status(404).send('Carrito no encontrado');
      }
    });
  });
  
  // Ruta para agregar un producto al carrito
  app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;
  
    fs.readFile(productosFilePath, (err, data) => {
      if (err) throw err;
      const productos = JSON.parse(data);
  
      const producto = productos.find(p => p.id === pid);
      if (!producto) {
        res.status(404).send('Producto no encontrado');
        return;
      }
  
      fs.readFile(carritoFilePath, (err, data) => {
        if (err) throw err;
        const carrito = JSON.parse(data);
  
        const productIndex = carrito.products.findIndex(p => p.id === pid);
        if (productIndex === -1) {
          carrito.products.push({
            id: pid,
            quantity: quantity
          });
        } else {
          carrito.products[productIndex].quantity += quantity;
        }
  
        fs.writeFile(carritoFilePath, JSON.stringify(carrito), (err) => {
          if (err) throw err;
          res.status(201).json(carrito);
        });
      });
    });
  });
  
  app.listen(8080, () => {
    console.log('Servidor escuchando en puerto 8080');
  });

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
});
