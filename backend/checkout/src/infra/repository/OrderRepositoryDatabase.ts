import Connection from "../database/Connection";
import Item from "../../domain/entity/Item";
import Order from "../../domain/entity/Order";
import OrderRepository from "../../application/repository/OrderRepository";

export default class OrderRepositoryDatabase implements OrderRepository{

    constructor (readonly connection: Connection){

    }

    async save(order: Order): Promise<void> {
        await this.connection.query("insert into commercebuddy.order (id_order, cpf, code, total, freight) values ($1, $2, $3, $4, $5)", [order.idOrder, order.cpf,  order.code, order.getTotal(), order.freight]);
        for (const item of order.items){
            await this.connection.query("insert into commercebuddy.item (id_order, id_product, price, quantity) values ($1, $2, $3, $4)", [order.idOrder, item.idProduct, item.price, item.quantity]);
        }
    }

    async getById(id: string): Promise<Order> {
        const [orderData] = await this.connection.query("select * from commercebuddy.order where id_order = $1", [id]);
        const order = new Order(orderData.id_order, orderData.cpf, undefined, 1, new Date());   
        const itemsData = await this.connection.query("select * from commercebuddy.item where id_order = $1", [id]);
        for (const itemData of itemsData) {
           order.items.push(new Item(itemData.id_product, parseFloat(itemData.price), itemData.quantity, "BRL"));
        }
        return order;
    }

    async count(): Promise<number> {
        const [options] = await this.connection.query("select count(*) from commercebuddy.order", []);
        return parseInt(options.count);
    }
}