import GetProducts from "../../src/application/usecase/GetProducts";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import ProductRepositoryDatabase from "../../src/infra/repository/ProductRepositoryDatabase";

test("Deve listar os produtos", async function(){
    const connection = new PgPromiseAdapter();
    const productRepository = new ProductRepositoryDatabase(connection);
    const getProducts = new GetProducts(productRepository);
    const output = await getProducts.execute();
    expect(output).toHaveLength(3);
    await connection.close();
})