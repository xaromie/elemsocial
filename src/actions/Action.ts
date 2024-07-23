import { Client } from "../structures/Client";

export class Action {
    public client: Client | null = null;
    public action: Function | null = null;

    constructor(client: Client, action: Function) {
        this.client = client;
        this.action = action;
    }

    public handle(data: any): void {
        this.action(this.client, data);
    };
}