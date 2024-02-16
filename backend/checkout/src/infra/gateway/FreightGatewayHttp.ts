import HttpClient from "../http/HttpClient";
import FreightGateway, { Input } from "../../application/gateway/FreightGateway";

export default class FreightGatewayHttp implements FreightGateway {

    constructor (readonly httpClient: HttpClient) {

    }
    
    async calculateFreight(input: Input) {
        return await this.httpClient.post("http://localhost:3002/calculateFreight", input);        
    }
}