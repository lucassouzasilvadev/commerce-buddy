import AxiosAdapter from "./infra/http/AxiosAdapter";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpController from "./infra/http/HttpController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import StockEntry from "./domain/entity/StockEntry";
import StockEntryRepository from "./application/repository/StockEntryRepository";
import DecrementStock from "./application/usecase/DecrementStock";
import CalculateStock from "./application/usecase/CalculateStock";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import QueueController from "./infra/queue/QueueController";

async function main () {
    const httpServer = new ExpressAdapter();
    const connection = new PgPromiseAdapter();
    const httpClient = new AxiosAdapter();
    const stockEntries: StockEntry [] = [
        new StockEntry(1, "in", 20)
    ];
    const stockEntryRepository: StockEntryRepository = {
        async save (stockEntry: StockEntry){
            stockEntries.push(stockEntry);
        },
        async list (idProduct: number) {
            return stockEntries.filter((stockEntry: StockEntry) => stockEntry.idProduct === idProduct);
        }
    }
    const decrementStock = new DecrementStock(stockEntryRepository);
    const calculateStock = new CalculateStock(stockEntryRepository);
    new HttpController(httpServer, decrementStock, calculateStock);
    const queue = new RabbitMQAdapter();
    await queue.connect();
    new QueueController(queue, decrementStock);
    httpServer.listen(3005);
}

main();