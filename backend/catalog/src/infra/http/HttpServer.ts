export default interface HttpServer {
    on (mehtod: string, url: string, callback: Function): void;
    listen (port: number): void;
}