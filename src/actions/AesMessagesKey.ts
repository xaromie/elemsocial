import { Client } from "../structures/Client";
import { ElemsocialError } from "../structures/ElemsocialError";

export function AesMessagesKey(client: Client, data: any) {
    if (data.status == 'error') {
        throw new ElemsocialError(data.content);
    };
};