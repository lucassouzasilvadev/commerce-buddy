import Sinon from "sinon";
import Checkout from "../../src/application/usecase/Checkout";
import CurrencyGatewayHttp from "../../src/infra/gateway/CurrencyGatewayHttp";
import ProductRepositoryDatabase from "../../src/infra/repository/ProductRepositoryDatabase";
import CouponRepositoryDatabase from "../../src/infra/repository/CouponRepositoryDatabase";
import CurrencyGateway from "../../src/application/gateway/CurrencyGateway";
import ProductRepository from "../../src/application/repository/ProductRepository";
import GetOrder from "../../src/application/usecase/GetOrder";
import crypto from "crypto";
import OrderRepositoryDatabase from "../../src/infra/repository/OrderRepositoryDatabase";
import Product from "../../src/domain/entity/Product";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import Connection from "../../src/infra/database/Connection";
import CouponRepository from "../../src/application/repository/CouponRepository";
import OrderRepository from "../../src/application/repository/OrderRepository";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import CatalogGatewayHttp from "../../src/infra/gateway/CatalogGatewayHttp";
import AuthDecorator from "../../src/application/decorator/AuthDecorator";
import Queue from "../../src/infra/queue/Queue";
import RabbitMQAdapter from "../../src/infra/queue/RabbitMQAdapter";

let checkout: Checkout;
let getOrder: GetOrder;
let connection: Connection;
let currencyGateway: CurrencyGateway;
let productRepository: ProductRepository;
let couponRepository: CouponRepository;
let orderRepository: OrderRepository;
let queue: Queue;

beforeEach(async function(){
    connection = new PgPromiseAdapter();
    const httpClient = new AxiosAdapter();
    queue = new RabbitMQAdapter();
    await queue.connect();
    currencyGateway = new CurrencyGatewayHttp(httpClient);
    productRepository = new ProductRepositoryDatabase(connection);
    couponRepository = new CouponRepositoryDatabase(connection);
    orderRepository = new OrderRepositoryDatabase(connection);
    checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository, undefined, undefined, undefined, queue);
    getOrder = new GetOrder(orderRepository);
});

afterEach(async function (){
    await connection.close();
});

test("não deve aceitar um pedido com cpf inválido", async function(){
    const input = {
        cpf: "429.875.898-25",
        items: []
    }
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});


test("deve criar um pedido vazio com cpf válido", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: []
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(0)
});


test("deve criar um pedido com 3 produtos", async function() {
    const uuid = crypto.randomUUID();
    const input = {
        uuid: uuid,
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ]
    }
    await checkout.execute(input);
    const output = await getOrder.execute(uuid);
    expect(output.total).toBe(6090);
});

test("deve criar um pedido vazio com 3 produtos com cupom de desconto", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ],
        coupon: "VALE20"
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(4872);
});

test("não deve aplicar um cupom de desconto expirado", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ],
        coupon: "VALE10"
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(6090);
});

test("não deve criar um pedido com quantidade negativa", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            { idProduct: 1, quantity: -1 }        
        ],
    }
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid quantity"));
});

test("não deve criar um pedido com item duplicado", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 1, quantity:1}             
        ],
    }
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Duplicated item"));
});

test("deve criar um pedido com 1 produto calculando o frete", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:3}
        ],
        from: "22060030",
        to: "88015600"
    }
    const output = await checkout.execute(input);
    expect(output.freight).toBe(67.33996002073468);
    expect(output.total).toBe(3067.339960020735);
});


test("não deve criar um pedido se o produto tiver alguma dimensao negativa", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 4, quantity:1}
        ]
    }
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid dimension"));
});


test("deve criar um pedido com 1 produto calculando o frete", async function() {
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 3, quantity:1}
        ],
        from: "123456",
        to: "1234534"
    }
    const output = await checkout.execute(input);
    expect(output.freight).toBe(10);
    expect(output.total).toBe(40);
});

test("deve criar um pedido com 1 produto em dolar usando stub", async function() {
    const stubCurrencyGateway = Sinon.stub(CurrencyGatewayHttp.prototype, "getCurrencies").resolves({
        usd: 3
    });
    const input = {
        cpf: "429.875.898-24",
        items: [
            { idProduct: 5, quantity: 1 }           
        ]
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    stubCurrencyGateway.restore();
});

test("deve criar um pedido vazio com 3 produtos com cupom de desconto com spy", async function() {
    const spyCouponRepository = Sinon.spy(CouponRepositoryDatabase.prototype, "getCoupoun");
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ],
        coupon: "VALE20"
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(4872);
    expect(spyCouponRepository.calledOnce).toBeTruthy();
    expect(spyCouponRepository.calledWith("VALE20")).toBeTruthy();
    spyCouponRepository.restore();
});

test("deve criar um pedido com 1 produto em dolar usando um mock", async function() {
    const mockCurrencyGateway = Sinon.mock(CurrencyGatewayHttp.prototype);
    mockCurrencyGateway.expects("getCurrencies").once().resolves({
        usd: 3
    })
    const input = {
        cpf: "429.875.898-24",
        items: [
            { idProduct: 5, quantity: 1 }           
        ]
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    mockCurrencyGateway.verify();
    mockCurrencyGateway.restore();
});

test("deve criar um pedido com 1 produto em dolar usando um fake", async function() {
    const currencyGateway: CurrencyGateway = {
        async getCurrencies(): Promise<any> {
            return {
                usd: 3
            };
        }
    }
    const productRepository: ProductRepository = {
        async getProduct(idProduct: number): Promise<any> {
            return new Product(6, "A", 1000, 10, 10, 10, 10, "USD");
        },

        async getProducts(): Promise<Product[]> {
            return [];
        }
    }
    const catalogGatewayStub = Sinon.stub(CatalogGatewayHttp.prototype, "getProduct").resolves(new Product(6, "A", 1000, 10, 10, 10, 10, "USD"));
    checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
    const input = {
        cpf: "429.875.898-24",
        items: [
            { idProduct: 6, quantity: 1 }           
        ]
    }
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    catalogGatewayStub.restore();
});

test("deve criar um pedido e verificar o código de série", async function() {
    const stub = Sinon.stub(OrderRepositoryDatabase.prototype, "count").resolves(1);
    const uuid = crypto.randomUUID();
    const input = {
        uuid: uuid,
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ]
    }
    await checkout.execute(input);
    const output = await getOrder.execute(uuid);
    expect(output.code).toBe("202400000001");
    stub.restore();
});

test("deve criar um pedido com 1 produto com cep", async function() {
    const uuid = crypto.randomUUID();
    const input = {
        uuid: uuid,
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1}
        ],
        from: "22060030",
        to: "88015600"
    }
    const output = await checkout.execute(input);
    expect(output.freight).toBe(22.446653340244893);
    expect(output.total).toBe(1022.446653340244893);
});


test("deve criar um pedido vazio com 3 produtos com cupom de desconto somente se estiver autenticado", async function() {
    const decoratedCheckout = new AuthDecorator(checkout);
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ],
        coupon: "VALE20",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzQGdtYWlsLmNvbSIsImlhdCI6MTcwNzU3MDAwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwfQ.yGhAkik06Ck0JOsuHWPVy5TO00f_dKrg2K4zMgFOt1I"
    }
    const output = await decoratedCheckout.execute(input);
    expect(output.total).toBe(4872);
});


test("não deve funcionar se não estiver autenticado", async function() {
    const decoratedCheckout = new AuthDecorator(checkout);
    const input = {
        cpf: "429.875.898-24",
        items: [
            {idProduct: 1, quantity:1},
            {idProduct: 2, quantity:1},
            {idProduct: 3, quantity:3}
        ],
        coupon: "VALE20",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzQGdtYWlsLmNvbSIsImlhdCI6MTcwNzU3MDAwMDAwMCwiZXhwaXJlc0luIjoxMDAwMD.yGhAkik06Ck0JOsuHWPVy5TO00f_dKrg2K4zMgFOt1I"
    }
    expect(() => decoratedCheckout.execute(input)).rejects.toThrow(new Error("Auth error"));
});

