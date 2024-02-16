import AuthGatewayHttp from "../../infra/gateway/AuthGatewayHttp";
import AxiosAdapter from "../../infra/http/AxiosAdapter";
import AuthGateway from "../gateway/AuthGateway";
import UseCase from "../usecase/UseCase";

export default class AuthDecorator implements UseCase {

    constructor (readonly useCase: UseCase, readonly authGateway: AuthGateway = new AuthGatewayHttp(new AxiosAdapter())
    ) {

    }

    async execute(input: any): Promise<any> {
        if(input && input.token) {
            try {
                const payload = await this.authGateway.verify(input.token);
                input.email = payload.email;
                return this.useCase.execute(input);
            } catch (e: any) {
                throw new Error("Auth error");      
            }       
        }else {
            return this.useCase.execute(input);
        }
    }
}