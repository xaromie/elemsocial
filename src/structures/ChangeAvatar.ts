import { EventEmitter } from 'stream';
import { Client } from './Client';
import { ElemsocialError } from './ElemsocialError';
import { ChangeAvatar, ChangeName } from './Types';
import axios from 'axios';

export class SettingsChangeAvatar {
  public client: Client | null = null;
  constructor(client: Client) {
    this.client = client;
  }

  public async edit(data: ChangeAvatar) {
    const formData = new FormData();
    const avatarFile = await fetch(data.avatarUrl).then((res) => res.blob());
    formData.append('Avatar', avatarFile, 'avatar.png');
    const resp = await axios.post(
      `${this.client.apiURL}/System/API/Settings.php?F=CP_UPLOAD_AVATAR`,
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
      throw new ElemsocialError('Не удалось изменить аватар');
    } else {
      return respData;
    }
  }

  public async delete() {
    const resp = await axios.post(
      `${this.client.apiURL}/System/API/Settings.php?F=DELETE_AVATAR`,
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
      throw new ElemsocialError('Не удалось удалить аватар');
    } else {
      return respData;
    }
  }
}
