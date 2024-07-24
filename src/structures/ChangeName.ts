import { EventEmitter } from 'stream';
import { Client } from './Client';
import { ElemsocialError } from './ElemsocialError';
import { ChangeName, DefaultResponse } from './Types';
import axios from 'axios';
export class SettingsChangeName {
  public client: Client | null = null;

  constructor(client: Client) {
    this.client = client;
  }

  public async edit(data: ChangeName) {
    const resp = await axios.post(
      `${this.client.apiURL}/System/API/Settings.php?F=CHANGE_NAME`,
      { Name: data.name },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'S-KEY': this.client.token,
        },
      }
    );
    const respData = resp.data;

    if (respData == 'Error') {
      throw new ElemsocialError('Не удалось изменить имя');
    } else {
      return {
        type: respData.Type,
        content: respData.Content,
      } as DefaultResponse;
    }
  }
}
