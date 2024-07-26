import { Client } from './Client';
import { MessagesOptions } from './Types';

export class Chat {
  public client: Client | null = null;
  public uid: number | null = null;

  constructor(options: MessagesOptions) {
    this.client = options.client;
    this.uid = options.uid;
  }

  public send(message: string): void {
    this.client.sendMessage(this.uid, message);
  }
  //
}
