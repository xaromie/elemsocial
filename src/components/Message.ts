import { Chat } from "../structures/Chat";
import { Client } from "../structures/Client";
import { CMessageOptions } from "../structures/Types";
import { User } from "./User";

export class Message {
    public from: User | null = null;
    public content: string | null;
    public date: Date | null;
    public chat: Chat | null;
    public client: Client | null = null;

    constructor(options: CMessageOptions) {
        this.from = options.from;
        this.content = options.content;
        this.date = options.date;
        this.client = options.client
        this.chat = options.chat;
    }

    public toString() {
        return this.content;
    }
}