import { Client } from "./Client";
import { webcrypto } from 'node:crypto';

export class WS {
    public client: Client | null = null;
    public socket: WebSocket | null = null;
    public e2e_publicKey: string | null = null;
    public e2e_privateKey: string | null = null;
    public e2e_serverKey: string | null = null;
    public aes_key: string | null = null;
    public aes_serverKey: string | null = null;

    constructor (client: Client) {
        this.client = client;
    }

    public async init() {
        await this.generateRSAKeyPair();
    };

    public async generateRSAKeyPair() {
        const keyPair = await webcrypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 3048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: { name: 'SHA-256' }
            },
            true,
            ['encrypt', 'decrypt']
        );
        const publicKey = await webcrypto.subtle.exportKey('spki', keyPair.publicKey);
        const privateKey = await webcrypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        this.e2e_publicKey = this.arrayBufferToPem(publicKey, 'PUBLIC KEY');
        this.e2e_privateKey = this.arrayBufferToPem(privateKey, 'PRIVATE KEY');
    }

    public arrayBufferToPem(arrayBuffer: ArrayBuffer, label: string) {
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const chunks = [];
      
        for (let i = 0; i < base64.length; i += 64) {
          chunks.push(base64.slice(i, i + 64));
        }
      
        return `-----BEGIN ${label}-----\n${chunks.join('\n')}\n-----END ${label}-----`;
    }

    public send(data: any) {
        if (this.socket.readyState === WebSocket.OPEN) {
            if (this.e2e_serverKey) {
                let jsonData = JSON.stringify(data);
                if (this.aes_serverKey) {
                    this.socket.send('d');
                } else {
                    this.socket.send('g');
                }
            } else {
                this.socket.send(JSON.stringify(data));
            };
        };
    }
}