import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct = async (product) => {
    const prod = await this.getProducts();
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.status ||
      !product.stock ||
      !product.category
    ) {
      return "Incompleto";
    } else {
      prod.length === 0
        ? (product.id = 1)
        : (product.id = prod[prod.length - 1].id + 1);
      prod.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(prod));
      return "Completo";
    }
  };

  getProducts = async (limit) => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);

      if (limit) {
        const limiteProductos = products.slice(0, limit);
        return limiteProductos;
      } else {
        //console.log(products);
        return products;
      }
    } else {
      return [];
    }
  };

  getProductById = async (id) => {
    const prod = await this.getProducts();
    const productindex = prod.findIndex((e) => e.id == id);
    if (productindex === -1) {
      return [];
    } else {
      return prod[productindex];
    }
  };

  updateProduct = async (id, product) => {
    const prod = await this.getProducts();
    const productindex = prod.findIndex((e) => e.id == id);

    if (productindex !== -1) {
      product.id = id;
      let newTodos = [...prod];
      newTodos[productindex] = { ...product };
      await fs.promises.writeFile(this.path, JSON.stringify(newTodos));
      return 200;
    } else {
      return 404;
    }
  };

  deleteProduct = async (id) => {
    const prod = await this.getProducts();
    const productindex = prod.findIndex((e) => e.id == id);
    if (productindex !== -1) {
      prod.splice(productindex, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(prod));
      return prod;
    } else {
      return [];
    }
  };
}
const pro = new ProductManager("./products.json");

//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
pro.getProducts();
