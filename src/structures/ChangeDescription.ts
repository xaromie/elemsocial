import { EventEmitter } from 'stream';
import { Client } from './Client';
import { ElemsocialError } from './ElemsocialError';
import { ChangeDescription } from './Types';
import axios from 'axios';
export class SettingsChangeDescription {
  public client: Client | null = null;

  constructor(client: Client) {
    this.client = client;
  }

  public async edit(data: ChangeDescription) {
    const resp = await axios.post(
      `${this.client.apiURL}/System/API/Settings.php?F=CHANGE_DEC`,
      { Description: data.description },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'S-KEY': this.client.token,
        },
      }
    );

    const respData = resp.data;

    if (respData == 'Error') {
      throw new ElemsocialError('Не удалось изменить описание');
    } else {
      return respData;
    }
  }
}
