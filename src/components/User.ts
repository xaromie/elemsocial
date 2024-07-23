import { Client } from "../structures/Client";
import { Chat } from "../structures/Chat";
import { MessageOptions } from "../structures/Types";

export class User {
    public client: Client | null;
    public id: number | null = null;
    public chat: Chat | null = null;

    constructor(options: MessageOptions) {
        this.client = options.client;
        this.id = options.id;
        this.chat = new Chat({
            client: this.client,
            uid: this.id
        });
    }
};