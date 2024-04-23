//Importo Express
import express from "express";
//Importo configuracion
import config from "./config.js";
//Importo Rutas
import IndexRoute from "./routes/index.router.js";
import CartRoute from "./routes/cart.router.js";
import ProductsRoute from "./routes/products.router.js";

// Configuracion basica
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Carpeta static
app.use("/static", express.static(`${config.DIRNAME}/public`));

//Router
app.use(IndexRoute);
app.use(CartRoute);
app.use(ProductsRoute);

//Server
app.listen(config.PORT, (req, res) => {
  console.log(`Server levantado sobre puerto: ${config.PORT}`);
});
