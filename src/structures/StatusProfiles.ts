import axios from 'axios';
import { Client } from './Client';
import { ElemsocialError } from './ElemsocialError';
import { StatusData } from './Types';

export class SettingsStatusProfile {
  public client: Client | null = null;

  constructor(client: Client) {
    this.client = client;
  }

  public async get() {
    const resp = await axios.post(
      `${this.client.apiURL}/System/API/Settings.php?F=GET_STATUS`,
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
      throw new ElemsocialError('Не удалось получить статус профиля');
    } else {
      return {
        post: respData.Permissions.Posts,
        comments: respData.Permissions.Comments,
        newChats: respData.Permissions.NewChats,
        musicUpload: respData.Permissions.MusicUpload,
      } as StatusData;
    }
  }
}
