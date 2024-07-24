import axios from 'axios';
import { Client } from './Client';
import { ElemsocialError } from './ElemsocialError';
import { AuthorsData } from './Types';

export class SettingsAuthors {
  public client: Client | null = null;

  constructor(client: Client) {
    this.client = client;
  }

  public async get() {
    const resp = await axios.get(
      `${this.client.apiURL}/System/API/Settings.php?F=GET_AUTHORS`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'S-KEY': this.client.token,
        },
      }
    );

    const respData = resp.data;

    if (respData.Type === 'Error') {
      throw new ElemsocialError('Не удалось получить список авторов');
    } else {
      return respData.map((author: any) => ({
        name: author.Name,
        username: author.Username,
        avatar: author.Avatar,
        jobTitle: author.JobTitle,
      })) as AuthorsData[];
    }
  }
}
