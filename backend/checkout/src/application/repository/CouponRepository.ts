import Coupon from "../../domain/entity/Coupon";

export default interface CouponRepository  {
    getCoupoun(code: string): Promise<Coupon>;
}