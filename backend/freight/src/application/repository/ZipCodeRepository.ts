import ZipCode from "../../domain/entity/ZipCode";

export default interface ZipCodeRepository {
    get (code: string): Promise<ZipCode | undefined>;
}