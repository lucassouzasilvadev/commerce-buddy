import pgp from "pg-promise";
import ProductRepository from "../../application/repository/ProductRepository";
import Product from "../../domain/entity/Product";
import Connection from "../database/Connection";

export default class ProductRepositoryDatabase implements ProductRepository {

    constructor (readonly connection: Connection){
         
    }

    async getProduct(idProduct: number): Promise<Product>{
        const [productData] = await this.connection.query("select * from commercebuddy.product where id_product = $1", idProduct);
        return new Product(productData.id_product, productData.description, parseFloat(productData.price), productData.width, productData.height, productData.length, parseFloat(productData.weight), productData.currency);
    }

    async getProducts(): Promise<Product[]> {
        const productsData = await this.connection.query("select * from commercebuddy.product where id_product in (1, 2, 3)", []);
        const products = [];
        for (const productData of productsData){
            products.push(new Product(productData.id_product, productData.description, parseFloat(productData.price), productData.width, productData.height, productData.length, parseFloat(productData.weight), productData.currency));             
        }
        return products;
    }

}