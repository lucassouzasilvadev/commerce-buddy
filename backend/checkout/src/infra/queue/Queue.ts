export default interface Queue {
    connect (): Promise<void>;
    publish (queueName: string, data: any): Promise<void>;
}