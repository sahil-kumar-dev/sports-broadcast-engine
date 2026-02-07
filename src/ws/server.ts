import { WebSocket, WebSocketServer } from 'ws'

export function sendJson(socket: WebSocket, payLoad: any) {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payLoad))
}

export function broadcast(clients: Iterable<WebSocket>, payLoad: any) {
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(payLoad))
        }
    }
}

export function attachWebSocketServer(httpServer: any) {
    const wss = new WebSocketServer({
        server: httpServer,
        path: '/ws',
        maxPayload: 1024 * 1024
    })

    wss.on('connection', (socket: WebSocket) => {
        sendJson(socket, {
            type: 'welcome',
            message: 'Welcome to the WebSocket server'
        })
        socket.on('error', console.error)
    })

    function broadcastMatchCreated(match: any) {
        if (wss.clients) {
            broadcast(wss.clients, {
                type: 'match_created',
                data: match
            })
        }
    }

    function broadcastMatchUpdated(match: any) {
        if (wss.clients) {
            broadcast(wss.clients, {
                type: 'match_updated',
                data: match
            })
        }
    }

    return {
        broadcastMatchCreated,
        broadcastMatchUpdated
    }
}