import express from "express";
import { Request, Response } from "express";
import Checkout from "./application/usecase/Checkout";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import CurrencyGatewayHttp from "./infra/gateway/CurrencyGatewayHttp";
import ProductRepositoryDatabase from "./infra/repository/ProductRepositoryDatabase";
import CouponRepositoryDatabase from "./infra/repository/CouponRepositoryDatabase";
import OrderRepositoryDatabase from "./infra/repository/OrderRepositoryDatabase";
import AxiosAdapter from "./infra/http/AxiosAdapter";

const app = express();
app.use(express.json())


app.post("/checkout", async function(req: Request, res: Response) {
    try{
        const connection = new PgPromiseAdapter();
        const httpClient = new AxiosAdapter();
        const currencyGateway = new CurrencyGatewayHttp(httpClient);
        const productRepository = new ProductRepositoryDatabase(connection);
        const couponRepository = new CouponRepositoryDatabase(connection);
        const orderRepository = new OrderRepositoryDatabase(connection);
        const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
        const output = await checkout.execute(req.body);
        res.json(output);
    } catch (e: any){
        res.status(422).json({
            message: e.message
        });
    }
    
});



app.listen(3000);