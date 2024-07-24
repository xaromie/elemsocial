import { Message } from "../components/Message";
import { User } from "../components/User";
import { Chat } from "../structures/Chat";
import { Client } from "../structures/Client";

export function NewMessage(client: Client, data: any) {
    const user = new User({
        client: client,
        id: data.uid,
    });
    const message = new Message({
        from: user,
        chat: new Chat({ client: client, uid: data.uid }),
        content: data.message,
        date: new Date(data.date.split(' ').slice(0,2).join(' ')),
        client: client
    });
    client.emit('message', message);
};