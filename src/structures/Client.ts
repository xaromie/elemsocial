import EventEmitter from 'events';
import { DefaultResponse, ClientData, ClientOptions } from './Types';
import axios from 'axios';
import { ElemsocialError } from './ElemsocialError';
import { Posts } from './Posts';
import { WS } from './WS';
import { ActionManager } from '../actions/ActionManager';
import { Settings } from './Settings';

export class Client extends EventEmitter {
  public wsURL: string = 'wss://wselem.xyz:2053';
  public apiURL: string = 'https://elemsocial.com';
  public token: string | null = null;
  public data: ClientData | null = null;
  public actions: ActionManager | null = null;
  public ws: WS = new WS(this);

  public posts: Posts = new Posts(this);
  public settings: Settings = new Settings(this);
  public name = this.settings.name;
  public description = this.settings.description;
  public avatar = this.settings.avatar;
  public cover = this.settings.cover;
  public authors = this.settings.authors;
  public status = this.settings.status;
  public gold = this.settings.gold;
  public links = this.settings.links;
  constructor(options: ClientOptions) {
    super();

    this.actions = new ActionManager(this);
    this.data = {
      email: options.email,
      password: options.password,
      chatKey: options.chatKey,
    };

    if (options.apiURL) {
      this.apiURL = options.apiURL;
    }
    if (options.wsURL) {
      this.wsURL = options.wsURL;
    }
  }

  public sendMessage(uid: number, message: string): void {
    this.ws.send({
      type: 'send_message',
      uid: uid,
      message: message,
    });
  }

  public async login(): Promise<void> {
    const resp = await axios.post(
      `${this.apiURL}/System/API/Authorization.php?F=LOGIN`,
      new URLSearchParams({
        Email: this.data.email,
        Password: this.data.password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const respData: DefaultResponse = resp.data;

    if (respData.Type == 'Verify') {
      this.token = respData.Content;
      this.ws.connect();
      this.emit('ready', this);
    } else if (respData.Type == 'Error') {
      throw new ElemsocialError(respData.Content);
    }
  }
  //
}
