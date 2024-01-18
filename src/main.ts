import express from "express";
import { validate } from "./validator";
import { Request, Response } from "express";
import pgp from "pg-promise";

const app = express();
app.use(express.json())


app.post("/checkout", async function(req: Request, res: Response) {
    try{
        const isValid = validate(req.body.cpf);
        if(!isValid) throw new Error("Invalid cpf");
        const output: Output = {
            total: 0
        };
        const connection = pgp()("postgres://postgres:admin@localhost:5432/postgres");
        const items: any = [];
        if(req.body.items){
            for(const item of req.body.items){
                if(item.quantity <= 0) throw new Error("Invalid quantity");
                if(items.includes(item.idProduct)) throw new Error("Duplicated item");
                const [productData] = await connection.query("select * from commercebuddy.product where id_product = $1", item.idProduct);
                output.total += parseFloat(productData.price) * item.quantity;                
                items.push(item.idProduct);
            }   
        }       
        if(req.body.coupon){
            const [couponData] = await connection.query("select * from commercebuddy.coupon where code = $1", [req.body.coupon]);
            if(couponData.expire_date.getTime() >= new Date().getTime()) {
                const percentage = parseFloat(couponData.percentage);
                output.total -= (output.total * percentage)/100;
            }        
        }      
        await connection.$pool.end();
        res.json(output);
    }catch(e: any){
        res.status(422).json({
            message: e.message
        });
    } 
});


type Output = {
    total: number
}

app.listen(3000);