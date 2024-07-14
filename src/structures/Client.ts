import EventEmitter from "events";
import { DefaultResponse, ClientData, ClientOptions } from "./Types";
import axios from "axios";
import { ElemsocialError } from "./ElemsocialError";
import { Posts } from "./Posts";

export class Client extends EventEmitter {
    public wsURL: string = 'wss://wselem.xyz:2053';
    public apiURL: string = 'https://elemsocial.com';
    public token: string | null = null;
    public data: ClientData | null = null;

    public posts: Posts = new Posts(this);

    constructor (options: ClientOptions) {
        super();

        this.data = { email: options.email, password: options.password, chatKey: options.chatKey };

        if (options.apiURL) {
            this.apiURL = options.apiURL;
        };
        if (options.wsURL) {
            this.wsURL = options.wsURL;
        };

        setInterval(() => {}, 60000);
    }

    public async login(): Promise<void> {
        const resp = await axios.post(`${this.apiURL}/System/API/Authorization.php?F=LOGIN`,
            new URLSearchParams({ Email: this.data.email, Password: this.data.password }),
            {
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded'
                }
            }
        );
        const respData: DefaultResponse = resp.data;

        if (respData.Type == 'Verify') {
            this.token = respData.Content;
            this.emit('ready', this);
        } else if (respData.Type == 'Error') {
            throw new ElemsocialError(respData.Content);
        };
    };
}