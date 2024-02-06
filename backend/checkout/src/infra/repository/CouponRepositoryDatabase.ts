import CouponRepository from "../../application/repository/CouponRepository";
import Coupon from "../../domain/entity/Coupon";
import Connection from "../database/Connection";


export default class CouponRepositoryDatabase implements CouponRepository {

    constructor (readonly connection: Connection) {

    }

    async getCoupoun(code: string): Promise<Coupon>{
        const [couponData] = await this.connection.query("select * from commercebuddy.coupon where code = $1", [code]);        
        return new Coupon(couponData.code, parseFloat(couponData.percentage), couponData.expire_date);
    }
}