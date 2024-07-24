import EventEmitter from 'events';
import { DefaultResponse, ClientData, ClientOptions } from './Types';
import axios from 'axios';
import { ElemsocialError } from './ElemsocialError';
import { Posts } from './Posts';
import { SettingsChangeName } from './ChangeName';
import { SettingsChangeDescription } from './ChangeDescription';
import { SettingsChangeAvatar } from './ChangeAvatar';
import { SettingsChangeCover } from './ChangeCover';
import { SettingsStatusProfile } from './StatusProfiles';
import { SettingsAuthors } from './Authors';

export class Client extends EventEmitter {
  public wsURL: string = 'wss://wselem.xyz:2053';
  public apiURL: string = 'https://elemsocial.com';
  public token: string | null = null;
  public data: ClientData | null = null;
  public changeName: SettingsChangeName = new SettingsChangeName(this);
  public changeDescription: SettingsChangeDescription =
    new SettingsChangeDescription(this);
  public posts: Posts = new Posts(this);
  public changeAvatar: SettingsChangeAvatar = new SettingsChangeAvatar(this);
  public changeCover: SettingsChangeCover = new SettingsChangeCover(this);
  public status: SettingsStatusProfile = new SettingsStatusProfile(this);
  public authors: SettingsAuthors = new SettingsAuthors(this);
  constructor(options: ClientOptions) {
    super();

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

    setInterval(() => {}, 60000);
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
      this.emit('ready', this);
    } else if (respData.Type == 'Error') {
      throw new ElemsocialError(respData.Content);
    }
  }
}
