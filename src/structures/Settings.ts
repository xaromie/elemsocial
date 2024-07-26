import axios, { Axios } from 'axios';
import { Client } from './Client';
import {
  AuthorsOptions,
  DefaultResponse,
  getLinksOptions,
  GoldListOptions,
  GoldOptions,
  StatusOptions,
} from './Types';
import { ElemsocialError } from './ElemsocialError';

export class Settings {
  public client: Client | null = null;

  constructor(client: Client) {
    this.client = client;
  }
  //Смена никнейма
  public name = {
    edit: async (newName: string) => {
      const resp = await axios.post(
        `${this.client.apiURL}/System/API/Settings.php?F=CHANGE_NAME`,
        { Name: newName },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'S-KEY': this.client.token,
          },
        }
      );
      const respData = resp.data;

      if (respData.Type == 'Verify') {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      } else {
        throw new Error(respData.Content);
      }
    },
  };
  //Смена описания
  public description = {
    edit: async (newDescription: string) => {
      const resp = await axios.post(
        `${this.client.apiURL}/System/API/Settings.php?F=CHANGE_DESC`,
        { Description: newDescription },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'S-KEY': this.client.token,
          },
        }
      );
      const respData = resp.data;

      if (respData.Type == 'Verify') {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      } else {
        throw new Error(respData.Content);
      }
    },
  };
  //Смена аватаркки
  public avatar = {
    edit: async (newAvatar: string) => {
      const formData = new FormData();
      const avatarFile = await fetch(newAvatar).then((res) => res.blob());
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

      if (respData.Type == 'Verify') {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      } else {
        throw new Error(respData.Content);
      }
    },
    delete: async () => {
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

      if (respData.Type == 'Verify') {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      } else {
        throw new Error(respData.Content);
      }
    },
  };
  //Смена баннера
  public cover = {
    edit: async (newCover: string) => {
      const formData = new FormData();
      const coverFile = await fetch(newCover).then((res) => res.blob());
      formData.append('Cover', coverFile, 'cover.png');
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

      if (respData.Type == 'Verify') {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      } else {
        throw new Error(respData.Content);
      }
    },
    delete: async () => {
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

      if (respData.Type == 'Verify') {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      } else {
        throw new Error(respData.Content);
      }
    },
  };
  //Получение списка авторов
  public authors = {
    get: async () => {
      const resp = await axios.post(
        `${this.client.apiURL}/System/API/Settings.php?F=GET_AUTHORS`,
        {},
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
        return respData.map((author) => ({
          avatar: author.Avatar,
          jobTitle: author.JobTitle,
          name: author.Name,
          username: author.Username,
        })) as AuthorsOptions[];
      }
    },
  };
  //Получение статуса
  public status = {
    get: async () => {
      const resp = await axios.get(
        `${this.client.apiURL}/System/API/Settings.php?F=GET_STATUS`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'S-KEY': this.client.token,
          },
        }
      );
      const respData = resp.data;

      if (respData.Type === 'Error') {
        throw new ElemsocialError('Не удалось получить статус');
      } else {
        return {
          FalseCount: respData.FalseCount,
          Permissions: {
            Comments: respData.Comments,
            MusicUpload: respData.MusicUpload,
            NewChats: respData.NewChats,
            Posts: respData.Posts,
          },
        } as StatusOptions;
      }
    },
  };
  //Получение состояния Gold-подписки
  public gold = {
    check: async () => {
      const resp = await axios.get(
        `${this.client.apiURL}/System/API/Settings.php?F=GET_GOLD_INFO`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'S-KEY': this.client.token,
          },
        }
      );

      const respData = resp.data;

      if (respData.Type === 'Error') {
        throw new ElemsocialError(
          'Не удалось получить состояние Gold-подписки'
        );
      } else {
        return {
          activated: respData.activated,
          activatedHistory: respData.activatedHistory,
        } as GoldOptions;
      }
    },
    buy: async (data: { text: string }) => {
      const resp = await axios.post(
        `
        ${this.client.apiURL}/System/Scripts/Interaction.php?F=SUB_ACT`,
        {
          Text: data.text,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'S-KEY': this.client.token,
          },
        }
      );

      const respData = resp.data;

      if (respData.Type === 'Error') {
        throw new ElemsocialError(respData.Content);
      } else {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      }
    },
    listUsers: async () => {
      const resp = await axios.get(
        `${this.client.apiURL}/System/Scripts/Interaction.php?F=GOLD_LIST`
      );
      const respData = resp.data;
      if (respData.Type === 'Error') {
        throw new ElemsocialError('Список Gold-пользователей не получен');
      } else {
        return {
          list: respData,
        } as GoldListOptions;
      }
    },
  };
  //Управление состоянием ссылок
  public links = {
    get: async (): Promise<getLinksOptions> => {
      const resp = await axios.get(
        `${this.client.apiURL}/System/API/Settings.php?F=GET_LINKS`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'S-KEY': this.client.token,
          },
        }
      );
      const respData = resp.data;

      if (respData.Type === 'Error') {
        throw new ElemsocialError('Не удалось получить список ссылок');
      } else {
        return {
          links: respData,
        };
      }
    },
    edit: async (data: { linkId: string; title: string; link: string }) => {
      const resp = await axios.post(
        `${this.client.apiURL}/System/API/Settings.php?F=EDIT_LINK`,
        {
          LinkID: data.linkId,
          Title: data.title,
          Link: data.link,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'S-KEY': this.client.token,
          },
        }
      );

      const respData = resp.data;

      if (respData.Type === 'Verify') {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      } else {
        throw new ElemsocialError('Не удалось изменить ссылку');
      }
    },
    delete: async (data: { linkId: string }) => {
      const resp = await axios.post(
        `${this.client.apiURL}/System/API/Settings.php?F=DELETE_LINK`,
        {
          LinkID: data.linkId,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'S-KEY': this.client.token,
          },
        }
      );
      const respData = resp.data;

      if (respData.Type === 'Verify') {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      } else {
        throw new ElemsocialError('Не удалось удалить ссылку');
      }
    },
    add: async (data: { title: string; link: string }) => {
      const resp = await axios.post(
        `${this.client.apiURL}/System/API/Settings.php?F=ADD_LINK`,
        {
          Title: data.title,
          Link: data.link,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'S-KEY': this.client.token,
          },
        }
      );

      const respData = resp.data;

      if (respData.Type === 'Verify') {
        return {
          Type: respData.Type,
          Content: respData.Content,
        } as DefaultResponse;
      } else {
        throw new ElemsocialError('Не удалось добавить ссылку');
      }
    },
  };
}
