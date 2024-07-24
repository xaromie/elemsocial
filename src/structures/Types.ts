import { Client } from "./Client"
import { User } from "../components/User"
import { Chat } from "./Chat"

export interface ClientOptions {
    wsURL?: string,
    apiURL?: string,
    email: string,
    password: string,
    chatKey: string
};

export interface ClientData {
    email: string,
    password: string,
    chatKey: string
};

export interface ClientType {
    wsURL: string,
    apiURL: string,
    token: string | null,
    data: ClientData | null,

    on(event: 'ready', listener: (client: ClientType) => void): this
};

export interface DefaultResponse {
    Type: string,
    Content: string
};

export interface PostOptions {
    Text?: string,
    Files?: Array<any>,
    ClearMetadataIMG?: boolean,
    CensoringIMG?: boolean
};

export interface PostbyId {
    id: string
};

export type PostsType = 'LATEST' | 'REC' | ' SUBSCRIPTIONS';

export interface ManyPostsOptions {
    type: PostsType,
    startIndex: number
};

export interface MessageOptions {
    client: Client,
    id: number
};

export interface CMessageOptions {
    from: User,
    content: string,
    date: Date,
    chat: Chat,
    client: Client
};

export interface MessagesOptions {
    client: Client,
    uid: number
};