// websocketClient.ts
import WebSocket from 'ws';
import { BLOFIN_ } from './config';

class BlofinWebSocketClient {
    private wsUrl: string;

    constructor() {
        this.wsUrl = API_CONFIG.publicWsUrl;
    }

    private onMessage(data: WebSocket.Data) {
        console.log('Received message:', data.toString());
    }

    private onError(error: Error) {
        console.error('WebSocket error:', error);
    }

    private onClose() {
        console.log('WebSocket connection closed');
    }

    private onOpen(ws: WebSocket) {
        console.log('WebSocket connection opened');
        const subscribeMessage = JSON.stringify({
            op: 'subscribe',
            args: [{ channel: 'tickers', instId: 'BTC-USDT' }]
        });
        ws.send(subscribeMessage);
    }

    public connect() {
        const ws = new WebSocket(this.wsUrl);

        ws.on('open', () => this.onOpen(ws));
        ws.on('message', this.onMessage);
        ws.on('error', this.onError);
        ws.on('close', this.onClose);
    }
}

export default BlofinWebSocketClient;