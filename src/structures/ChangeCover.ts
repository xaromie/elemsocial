import { EventEmitter } from 'stream';
import { Client } from './Client';
import { ElemsocialError } from './ElemsocialError';
import { ChangeAvatar, ChangeCover, ChangeName } from './Types';
import axios from 'axios';

export class SettingsChangeCover {
  public client: Client | null = null;
  constructor(client: Client) {
    this.client = client;
  }

  public async edit(data: ChangeCover) {
    const formData = new FormData();
    const avatarFile = await fetch(data.coverUrl).then((res) => res.blob());
    formData.append('Cover', avatarFile, 'cover.png');
    const resp = await axios.post(
      `${this.client.apiURL}/System/API/Settings.php?F=CP_UPLOAD_COVER`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'S-KEY': this.client.token,
        },
      }
    );

    const respData = resp.data;

    if (respData == 'Error') {
      throw new ElemsocialError('Не удалось изменить баннер');
    } else {
      return respData;
    }
  }

  public async delete() {
    const resp = await axios.post(
      `${this.client.apiURL}/System/API/Settings.php?F=DELETE_COVER`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'S-KEY': this.client.token,
        },
      }
    );

    const respData = resp.data;

    if (respData == 'Error') {
      throw new ElemsocialError('Не удалось удалить баннер');
    } else {
      return respData;
    }
  }
}
