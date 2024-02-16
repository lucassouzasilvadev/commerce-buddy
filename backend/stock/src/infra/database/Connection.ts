import { StringMap } from "ts-jest";

export default interface Connection {
    query (statement: string, params: any): Promise<any>;
    close (): Promise<void>;
}