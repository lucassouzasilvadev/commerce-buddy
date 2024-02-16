import HttpServer from "./HttpServer";
import Signup from "../../application/usecase/Singup";
import Login from "../../application/usecase/Login";
import Verify from "../../application/usecase/Verify";

export default class HttpController {

    constructor(readonly httpServer: HttpServer, 
                readonly signup: Signup,
                readonly login: Login,
                readonly verify: Verify
    ) {

        httpServer.on("post", "/signup", async function(params: any, body: any){
            const output = await signup.execute(body);
            return output;
        });

        httpServer.on("post", "/login", async function(params: any, body: any){
            if (typeof body.date === "string") {
                body.date = new Date(body.date);
           }
            const output = await login.execute(body);
            return output;
        });

        httpServer.on("post", "/verify", async function(params: any, body: any){
            const output = await verify.execute(body.token);
            return output;
        });
    }
}