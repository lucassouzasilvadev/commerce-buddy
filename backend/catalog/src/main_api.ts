import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpController from "./infra/http/HttpController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import ProductRepositoryDatabase from "./infra/repository/ProductRepositoryDatabase";
import GetProducts from "./application/usecase/GetProducts";
import GetProduct from "./application/usecase/GetProduct";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const productRepository = new ProductRepositoryDatabase(connection);
const getProducts = new GetProducts(productRepository);
const getProduct = new GetProduct(productRepository);
new HttpController(httpServer, getProducts, getProduct);
httpServer.listen(3003);