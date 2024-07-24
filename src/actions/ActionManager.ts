import { Client } from "../structures/Client";
import { Action } from "./Action";
import { AesMessagesKey } from "./AesMessagesKey";
import { NewMessage } from "./NewMessage";

export class ActionManager {
    public client: Client | null = null;
    [key: string]: any;

    constructor(client: Client) {
        this.client = client;

        this.NEW_MESSAGE = new Action(client, NewMessage);
        this.AES_MESSAGES_KEY = new Action(client, AesMessagesKey);
    }
}