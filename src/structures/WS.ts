import { Client } from "./Client";
import { webcrypto } from 'node:crypto';
import CryptoJS from 'crypto-js';
import WebSocket from 'ws';
import { User } from "../components/User";
import { Message } from "../components/Message";

export class WS {
    public client: Client | null = null;
    public socket: WebSocket | null = null;
    public e2e_publicKey: string | null = null;
    public e2e_privateKey: string | null = null;
    public e2e_serverKey: string | null = null;
    public aes_key: string | null = null;
    public aes_serverKey: string | null = null;
    public ping: number = -1;
    private hrtime: [number, number] | null = null;

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

    public importPublicKey(pk: string) {
        const base64String = pk
            .replace(/-----BEGIN PUBLIC KEY-----/, '')
            .replace(/-----END PUBLIC KEY-----/, '')
            .replace(/\s/g, '');
        const publicKeyBytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
        const publicKeyBuffer = publicKeyBytes.buffer;
        return publicKeyBuffer;
    }

    public importPrivateKey (pk: string) {
        const base64String = pk
            .replace(/-----BEGIN PRIVATE KEY-----/, '')
            .replace(/-----END PRIVATE KEY-----/, '')
            .replace(/\s/g, '');
        const privateKeyBytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
        const privateKeyBuffer = privateKeyBytes.buffer;
        return privateKeyBuffer;
    }

    public arrayBufferToBase64(buffer: ArrayBuffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return Buffer.from(binary, 'binary').toString('base64');
    }

    public async blobToUint8Array(blob: Blob) {
        const arrayBuffer = await blob.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    }

    public aes_createKey(word: string) {
        const hash = CryptoJS.SHA256(word);
        const key = hash.toString(CryptoJS.enc.Hex).slice(0, 32);
        return key;
    }

    public async e2e_encrypt(data: any, pk: string) {
        try {
            const publicKeyBuffer = this.importPublicKey(pk);
            const dataBuffer = new TextEncoder().encode(data);
            const publicKeyE = await crypto.subtle.importKey(
                'spki',
                publicKeyBuffer,
                { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
                true,
                ['encrypt']
            );
            const encryptedDataBuffer = await crypto.subtle.encrypt(
                { name: 'RSA-OAEP' },
                publicKeyE,
                dataBuffer
            );
            return new Uint8Array(encryptedDataBuffer);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async e2e_decrypt(data: any, pk: any) {
        try {
            const privateKeyBuffer = this.importPrivateKey(pk);
            const privateKeyE = await crypto.subtle.importKey(
                'pkcs8',
                privateKeyBuffer,
                { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
                true,
                ['decrypt']
            );
            const decryptedDataBuffer = await crypto.subtle.decrypt(
                { name: 'RSA-OAEP' },
                privateKeyE,
                data
            );
            const decryptedDataString = new TextDecoder().decode(decryptedDataBuffer);
            return decryptedDataString;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    public async aes_encrypt(data: any, key: any) {
        const iv = crypto.getRandomValues(new Uint8Array(16));
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        try {
            const importedKey = await crypto.subtle.importKey(
                'raw',
                Uint8Array.from(key),
                { name: 'AES-CBC' },
                false,
                ['encrypt', 'decrypt']
            );
            const cipher = crypto.subtle.encrypt(
                {
                    name: 'AES-CBC',
                    iv: iv
                },
                importedKey,
                encodedData
            );
            return cipher.then(encryptedBuffer => {
                const ivBase64 = this.arrayBufferToBase64(iv);
                const encryptedDataBase64 = this.arrayBufferToBase64(encryptedBuffer);
                return new TextEncoder().encode(ivBase64 + ':' + encryptedDataBase64);
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public base64ToArrayBuffer(base64String: string) {
        const binaryString = atob(base64String);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; ++i) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    public async aes_decrypt (data: any, key: any) {
        const parts = new TextDecoder().decode(data).split(':');
        const iv = this.base64ToArrayBuffer(parts[0]);
        const encrypted = this.base64ToArrayBuffer(parts[1]);
        const importedKey = await crypto.subtle.importKey(
            'raw',
            Uint8Array.from(key),
            { name: 'AES-CBC' },
            false,
            ['encrypt', 'decrypt']
        );
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: iv
            },
            importedKey,
            encrypted
        );
        const decryptedDataString = new TextDecoder().decode(decryptedBuffer);
        return decryptedDataString;
    }

    public async send(data: any) {
        if (this.socket.readyState === WebSocket.OPEN) {
            if (this.e2e_serverKey) {
                let jsonData = JSON.stringify(data);
                if (this.aes_serverKey) {
                    this.socket.send(await this.aes_encrypt(jsonData, this.aes_serverKey));
                } else {
                    this.socket.send(await this.e2e_encrypt(jsonData, this.e2e_serverKey));
                }
            } else {
                this.socket.send(JSON.stringify(data));
            };
        };
    }

    public startHeartbeat(): void {
        setInterval(() => {
            this.hrtime = process.hrtime();
            this.send({
                type: 'heartbeat'
            });
        }, 30000);
    }

    public enableHandlers(): void {
        this.socket.onopen = () => {
            this.send({
                type: 'key_exchange',
                key: this.e2e_publicKey
            });
        };

        this.socket.onclose = () => { console.log('close'); process.exit() };

        this.socket.onmessage = async (event) => {
            if (this.e2e_serverKey) {
                if (this.aes_serverKey) {
                    let data = JSON.parse(await this.aes_decrypt(new Uint8Array(event.data as any), this.aes_key));
                    
                    switch (data.type) {
                        case 'heartbeat': {
                            const endTime = process.hrtime(this.hrtime)
                            this.ping = Number(((endTime[0] * 1e9 + endTime[1]) / 1e6).toFixed(2));
                            this.client.emit('ping', this.ping);
                        };

                        case 'aes_messages_key': {
                            this.client.actions.AES_MESSAGES_KEY.handle(data);
                            break;
                        }

                        case 'new_message': {
                            this.client.actions.NEW_MESSAGE.handle(data);
                            break;
                        }

                        default: break;
                    };
                } else {
                    let data = JSON.parse(await this.e2e_decrypt(new Uint8Array(event.data as any), this.e2e_privateKey));
                    switch (data.type) {
                        case 'auth': {
                            const key = this.aes_createKey(this.e2e_publicKey);
                            this.aes_key = key;
                            this.send({
                                type: 'aes_key',
                                key: key
                            });
                            break;
                        }

                        case 'aes_key': {
                            this.aes_serverKey = data.key;
                            this.send({
                                type: 'aes_messages_key',
                                key: this.aes_createKey(this.client.data.chatKey)
                            });
                            break;
                        }

                        default: break;
                    };
                };
            } else {
                const data = JSON.parse(event.data.toString());
                if (data.type == 'key_exchange') {
                    this.e2e_serverKey = data.key;
                    this.send({
                        type: 'auth',
                        S_KEY: this.client.token
                    });
                };
            }
        };
    }

    public async connect() {
        await this.generateRSAKeyPair();

        this.socket = new WebSocket(this.client.wsURL);
        this.enableHandlers();
        this.startHeartbeat();
    }
}