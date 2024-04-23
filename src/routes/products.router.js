import { Router } from "express";
import { ProductManager } from "../manager/ProductManager.js";

import { uploader } from "../uploader.js";
import config from "../config.js";
const path = config.DIRNAME + "/productos.json";

//Instancio la clase
const pro = new ProductManager(path);

const router = Router();

//Ruta raiz donde devuelve todos los productos
router.get("/api/products", async (req, res) => {
  const limit = req.query.limit;
  const prod = await pro.getProducts(limit);
  res.send({ status: "success", payload: prod });
});

//Ruta con params pid, donde devuelve el producto
router.get("/api/products/:pid", async (req, res) => {
  let pid = req.params.pid;
  const prod = await pro.getProductById(pid);
  if (prod.length == 0) {
    res.send({ status: "success", payload: "Producto no encontrado" });
  } else {
    res.send({ status: "success", payload: prod });
  }
});

//Ruta para agregar productos
router.post("/api/products", uploader.array("thumbnails"), async (req, res) => {
  let files = req.files;
  if (!req.files) {
    return res
      .status(500)
      .send({ status: "error", error: "No se pudo guardar las imagenes" });
  }
  const arreglo = [];
  const thumbs = files.map((e) => {
    arreglo.push(e.path);
    return arreglo;
  });

  let product = req.body;
  product.thumbnails = arreglo;
  const prod = await pro.addProduct(product);
  if (prod == "Incompleto") {
    return res
      .status(400)
      .send({ status: "error", error: "Valores incompletos" });
  } else {
    return res
      .status(200)
      .send({ status: "success", message: "Se agrego el producto" });
  }
});

router.put("/api/products/:pid", async (req, res) => {
  let pid = req.params.pid;
  let producto = req.body;
  console.log(req.body);
  producto.id = pid;
  const prod = await pro.updateProduct(req.params.pid, producto);
  if (prod == 404) {
    return res
      .status(404)
      .send({ status: "error", error: "Producto no encontrado" });
  } else {
    res
      .status(200)
      .send({ status: "success", message: "Producto Actualizado" });
  }
});

router.delete("/api/products/:pid", async (req, res) => {
  let pid = req.params.pid;
  let producto = req.body;
  producto.id = pid;
  const prod = await pro.deleteProduct(req.params.pid);

  if (prod.length === 0) {
    return res
      .status(400)
      .send({ status: "error", error: "Producto no encontrado" });
  } else {
    res.send({
      status: "success",
      message: "Producto Eliminado",
    });
  }
});

export default router;
