import axios from "axios";
import { Client } from "./Client";
import { PostOptions, DefaultResponse, ManyPostsOptions, PostbyId } from "./Types";
import { ElemsocialError } from "./ElemsocialError";

export class Posts {
    public client: Client | null = null;

    constructor(client: Client) {
        this.client = client;
    }

    public async fetch(data: PostbyId) {
        const resp = await axios.post(`${this.client.apiURL}/System/API/LoadPost.php`,
            { PostID: data.id },
            {
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    'S-KEY': this.client.token
                }
            }
        );
        const respData = resp.data;

        if (respData == 'Error') {
            throw new ElemsocialError('Пост не найден');
        } else {
            return respData;
        };
    }

    public async create(data: PostOptions) {
        const resp = await axios.post(`${this.client.apiURL}/System/API/AddPost.php`,
            data,
            {
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    'S-KEY': this.client.token
                }
            }
        );
        const respData: DefaultResponse = resp.data;

        if (respData.Type == 'Verify') {
            return respData.Content;
        } else if (respData.Type == 'Error') {
            throw new ElemsocialError(respData.Content);
        };
    }
};