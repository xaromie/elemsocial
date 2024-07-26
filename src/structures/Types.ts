import { Client } from './Client';
import { User } from '../components/User';
import { Chat } from './Chat';
import exp from 'constants';
import { execPath } from 'process';

export interface ClientOptions {
  wsURL?: string;
  apiURL?: string;
  email: string;
  password: string;
  chatKey: string;
}

export interface ClientData {
  email: string;
  password: string;
  chatKey: string;
}

export interface ClientType {
  wsURL: string;
  apiURL: string;
  token: string | null;
  data: ClientData | null;

  on(event: 'ready', listener: (client: ClientType) => void): this;
}

export interface DefaultResponse {
  Type: string;
  Content: string;
}

export interface PostOptions {
  Text?: string;
  Files?: Array<any>;
  ClearMetadataIMG?: boolean;
  CensoringIMG?: boolean;
}

export interface PostbyId {
  id: string;
}

export type PostsType = 'LATEST' | 'REC' | ' SUBSCRIPTIONS';

export interface ManyPostsOptions {
  type: PostsType;
  startIndex: number;
}

export interface MessageOptions {
  client: Client;
  id: number;
}

export interface CMessageOptions {
  from: User;
  content: string;
  date: Date;
  chat: Chat;
  client: Client;
}

export interface MessagesOptions {
  client: Client;
  uid: number;
}

export interface AuthorsOptions {
  avatar: string;
  jobTitle: string;
  name: string;
  username: string;
}

export interface StatusOptions {
  FalseCount: number;
  Permissions: {
    Comments: boolean;
    MusicUpload: boolean;
    NewChats: boolean;
    Posts: boolean;
  };
}

export interface GoldOptions {
  activated: boolean;
  activatedHistory: Array<{
    Date: Date;
    ID: number;
    Received: string;
    Status: string;
    UserID: string;
  }>;
}

export interface getLinksOptions {
  links: Array<{
    ID: number;
    Link: string;
    Title: string;
  }>;
}

export interface GoldListOptions {
  list: Array<{
    Avatar: string;
    name: string;
    Posts: number;
    Subs: number;
    Username: string;
  }>;
}
