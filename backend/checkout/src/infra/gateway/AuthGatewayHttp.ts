import AuthGateway from "../../application/gateway/AuthGateway";
import HttpClient from "../http/HttpClient";

export default class AuthGatewayHttp implements AuthGateway {

    constructor (readonly httClient: HttpClient){

    }

    async verify(token: string): Promise<any> {
        return await this.httClient.post("http://localhost:3004/verify", { token });
    }

}