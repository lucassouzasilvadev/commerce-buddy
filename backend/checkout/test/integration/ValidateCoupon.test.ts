import Connection from "../../src/infra/database/Connection";
import CouponRepository from "../../src/application/repository/CouponRepository";
import CouponRepositoryDatabase from "../../src/infra/repository/CouponRepositoryDatabase";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import ValidateCoupon from "../../src/application/usecase/ValidateCoupon";

let validateCoupon: ValidateCoupon;
let connection: Connection;
let couponRepository: CouponRepository;

beforeEach(function(){
   connection = new PgPromiseAdapter();
   couponRepository = new CouponRepositoryDatabase(connection);
   validateCoupon = new ValidateCoupon(couponRepository);
});

afterEach(async function (){
    await connection.close();
});

test("Deve validar um cupom de desconto", async function() {
    const code = "VALE20";
    const output = await validateCoupon.execute(code);
    expect(output).toBeTruthy();
});
