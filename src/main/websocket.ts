// Import WebSocket to avoid 
import { WebSocketServer, WebSocket  } from "ws";
import { encode, decode } from '@msgpack/msgpack';
import { BrowserWindow, ipcMain } from "electron";
import { networkInterfaces } from 'os';
import { initializeGamepadSystem, createGamepad, xboxInput, dualShockInput, releaseGamepad } from './gamepadFactory'
import { GamepadData } from '../shared/types';
import { GamepadType } from '../shared/enums';

interface WebSocketMessage {
    action: "handshake_ack" | "register_ack" 
            | "delay_test_request" | "delay_test_end"
            | "error";
    status: "ok" | "error";
    payload: string;
}

interface ServerStatus {
    status: "closed" | "started" | "error";
    message?: string;
}

type WebSocketGamepadPayload = {
    action: string;
    id?: number;

    gamepadType: string;
    gamepadData?: GamepadData;
    timestamp?: number;
};

type WebSocketPingPayload = {
    action: string;
    id: number;

    timestamp: number;
    payload: string;
};

let wss: WebSocketServer | null = null;
let mainWindow: BrowserWindow | null = null;
let port: number = 8080; // Default port

interface ClientData {
    ip: string;
    websocket: WebSocket;

    // Connection test data
    isTestingDelay: boolean;
    // The time when server sent the message
    T1: number;
    // The time when client received the message
    T2: number;
    // The time when client sent the message
    T3: number;
    // The time when server received the message
    T4: number;

    rtt: number; // Round trip time
}

const clientMap: Map<number, ClientData> = new Map(); // Store client connections by ID

// Store all active communications in a Set
const connections = new Set<WebSocket>();

function newClientData(ip: string, websocket: WebSocket): ClientData {
    return {
        ip,
        websocket,

        isTestingDelay: false,
        T1: 0,
        T2: 0,
        T3: 0,
        T4: 0,
        rtt: 0,
    };
}
function getLocalIpAddresses(): string[] {
    const nets = networkInterfaces();
    const results: string[] = [];

    for (const name of Object.keys(nets)) {
        const interfaces = nets[name];
        if (!interfaces) continue;
        
        for (const net of interfaces) {
            if (net.family === 'IPv4' && !net.internal) {
                results.push(net.address);
            }
        }
    }
    return results;
}

function initWebSocketManager(window: BrowserWindow)
{
    mainWindow = window;

    ipcMain.on('wss:start', (_, portNumber) => {
        startServer(portNumber);
    });

    ipcMain.on('wss:stop', () => {
        stopServer();
    });

    ipcMain.handle('wss:get_server_ip', () => {
        const ipAddresses = getLocalIpAddresses();
        return {
            ips: ipAddresses,
            port: port,
            isRunning: wss !== null
        };
    });

    window.on('close', () => {
        stopServer();
        mainWindow = null; 
    });
}

function startServer(portNumber?: number)
{
    if(wss) {
        // Stop the existing server if it's already running
        stopServer();
    }

    port = (portNumber) ? portNumber : port; 
    wss = new WebSocketServer({ port });

    wss.on('listening', () => {
        mainWindow?.webContents.send('server-status', 
            {
                status: "started",
                port: port,
            }
        );

        initializeGamepadSystem();
        console.log(`WebSocket server started on port ${port}`);
    });

    wss.on('error', (error) => {
        mainWindow?.webContents.send('server-status',
            {
                status: "error",
                error: error.message,
            } as ServerStatus
        );
        console.error(`WebSocket server error: ${error.message}`);
    });
    
    wss.on('connection', (ws, req) => {        
        const clientIp = req.socket.remoteAddress;
        connections.add(ws);

        mainWindow?.webContents.send('client-connected', {
                ip: clientIp,
                totalConnections: connections.size,
        });

        console.log(`Client connected: ${clientIp}`);

        ws.on('message', (message) => {
            if (clientIp) {
                handleWebSocketMessage(ws, message, clientIp);
            } else {
                const response: WebSocketMessage = {
                    action: "error",
                    status: "error",
                    payload: "Unknown client IP",
                };
                ws.send(encode(response));
            }
        });

        ws.on('close', () => {
            // Remove the client from the clientMap
            for (const [id, data] of clientMap.entries()) {
                const _ws = data.websocket;
                if (_ws === ws) {
                    clientMap.delete(id);
                    break; 
                }
            }

            // Remove the client from the connections set
            connections.delete(ws);

            mainWindow?.webContents.send('client-disconnected', {
                ip: clientIp,
                totalConnections: connections.size,
            });

            mainWindow?.webContents.send('write-log', `Client: ${clientIp} disconnected`);
            console.log(`Client disconnected: ${clientIp}`);
        });
    });
}   

function stopServer()
{
    if (wss) {
        for (const connection of connections) {
            connection.close();
        }
    }

    connections.clear();

    wss?.close(() => {
        mainWindow?.webContents.send('server-status',
            {
                status: "closed",
            } as ServerStatus
        );

        wss = null;
    });
}

async function handleWebSocketMessage(ws: WebSocket, message: any, clientIp: string) {
    try {
        const decoded = decode(message) as WebSocketGamepadPayload | WebSocketPingPayload;

        switch (decoded?.action) {
            case 'handshake':
                await handleHandshake(ws, clientIp);
                break;

            case 'register':
                await handleRegister(ws, clientIp, decoded as WebSocketGamepadPayload);
                break;

            case 'input':
                await handleInput(ws, decoded as WebSocketGamepadPayload);
                break;

            case 'disconnect':
                await handleDisconnect(ws, decoded as WebSocketGamepadPayload);
                break;

            case 'delay_test_request_ack':
                await handleDelayTestRequestAck(decoded as WebSocketPingPayload);
                break;

            default:
                const response: WebSocketMessage = {
                    action: "error",
                    status: "error",
                    payload: "Invalid action",
                };
                ws.send(encode(response));
        }
    } catch (err) {
        console.error('Failed to decode incoming message:', err);
        mainWindow?.webContents.send('message-error', {
            error: 'Invalid MessagePack format',
            rawMessage: message
        });
    }

    async function handleHandshake(ws: WebSocket, clientIp: string): Promise<void> {
        const response: WebSocketMessage = {
            action: "handshake_ack",
            status: "ok",
            payload: "ok",
        };
        mainWindow?.webContents.send('write-log', `Client connected: ${clientIp}`);
        ws.send(encode(response));
    }

    async function handleDisconnect(_: WebSocket, payload: WebSocketGamepadPayload): Promise<void> {
        const { id } = payload;
        clientMap.delete(id as number);

        releaseGamepad(id as number);

        mainWindow?.webContents.send('gamepad:disconnected', { id });
    }

    async function handleRegister(ws: WebSocket, clientIp: string, payload: WebSocketGamepadPayload): Promise<void> {
        
        const clientId = await createGamepad(payload.gamepadType as GamepadType);
        const response: WebSocketMessage = {
            action: "register_ack",
            status: "ok",
            payload: clientId.toString(),
        };

        clientMap.set(clientId, newClientData(clientIp, ws));
        
        ws.send(encode(response));

        // Send a delay test message to the client 
        sendMessageToClient(clientId, "delay_test_request");
        
        mainWindow?.webContents.send('write-log', `Client: ${clientIp} assigned id ${clientId} as ${payload.gamepadType as GamepadType}`);
        
        // Send gamepad:registered event to renderer
        mainWindow?.webContents.send('gamepad:registered', {
            clientId: clientId,
            gamepadType: payload.gamepadType
        });
    }

    async function handleInput(ws: WebSocket, payload: WebSocketGamepadPayload): Promise<void> {
        const { id, gamepadType, gamepadData } = payload;

        let delayCounter: (() => void) | null = null;
        const client = clientMap.get(id as number);
        if (client && client.isTestingDelay) {
            const startTime = Date.now();
            delayCounter = () => {
                const diff = Date.now() - startTime + client.rtt;
                if (!mainWindow?.isMinimized()) {
                    mainWindow?.webContents.send('gamepad:get-delay', { id, delay: diff });
                }
            };
        }

        if (id === -1 || !gamepadType || !gamepadData) {
            const response: WebSocketMessage = {
                action: "error",
                status: "error",
                payload: "Missing id, gamepadType or gamepadData",
            };
            ws.send(encode(response));

            if (!id) console.log('Missing id');
            if (!gamepadType) console.log('Missing gamepadType');
            if (!gamepadData) console.log('Missing gamepadData');
            return;
        }

        if (gamepadType === GamepadType.Xbox) {
            xboxInput(id as number, gamepadData as GamepadData, delayCounter);
            if (!mainWindow?.isMinimized()) {
                mainWindow?.webContents.send('gamepad:input-xbox', { id, gamepadData });
            }
        } else if (gamepadType === GamepadType.DualShock) {
            dualShockInput(id as number, gamepadData as GamepadData, delayCounter);
            if (!mainWindow?.isMinimized()) {
                mainWindow?.webContents.send('gamepad:input-dualshock', { id, gamepadData });
            }
        }
    }

    async function handleDelayTestRequestAck(ping: WebSocketPingPayload): Promise<void> {
        const { id, timestamp, payload } = ping;

        clientMap.get(id as number)!.T2 = timestamp;
        clientMap.get(id as number)!.T3 = Number(payload);
        clientMap.get(id as number)!.T4 = Date.now();

        const T1 = clientMap.get(id as number)!.T1;
        const T2 = clientMap.get(id as number)!.T2;
        const T3 = clientMap.get(id as number)!.T3;
        const T4 = clientMap.get(id as number)!.T4;

        const rtt = ((T4 - T1) - (T3 - T2)) / 2;

        clientMap.get(id as number)!.rtt = rtt;
         mainWindow?.webContents.send('write-log', `Client: ${clientIp} has delay of ${rtt}ms`);

    }
}

async function sendMessageToClient(clientId: number, action: string) {
    console.log(`Sending message to client ${clientId}: ${action}`);
    switch (action) {
        case "delay_test_request":
            HandleDelayTestRequest(clientId);
            break;
        // case "delay_test_start":
        //     HandleDelayTestStart(clientId);
        //     break;
        case "delay_test_end":
            HandleDelayTestEnd(clientId);
            break;
        default:
            console.error(`Unknown action: ${action}`);
            break;
    }

    function HandleDelayTestRequest(clientId: number) {
        const now = Date.now();
        clientMap.get(clientId)!.T1 = now;

        const response: WebSocketMessage = {
            action: "delay_test_request",
            status: "ok",
            // Send the current UTC time in milliseconds
            payload: Date.now().toString(),
        };
        const ws = clientMap.get(clientId)?.websocket;
        clientMap.get(clientId)!.isTestingDelay = true;

        if (ws) {
            console.log(`Last call Sending delay test message to client ${clientId}`);
            ws.send(encode(response));
        } else {
            console.error(`Client ${clientId} not found`);
        }   
    }

    
    // function HandleDelayTestStart(clientId: number) {
    //     const response: WebSocketMessage = {
    //         action: "delay_test_start",
    //         status: "ok",
    //         // Send the current UTC time in milliseconds
    //         payload: clientMap.get(clientId)?.rtt.toString() || "0",
    //     };
        
    //     const ws = clientMap.get(clientId)?.websocket;
    //     clientMap.get(clientId)!.isTestingDelay = true;

    //     if (ws) {
    //         console.log(`Last call Sending delay test message to client ${clientId}`);
    //         ws.send(encode(response));
    //     } else {
    //         console.error(`Client ${clientId} not found`);
    //     }   
    // }

    function HandleDelayTestEnd(clientId: number) {
        const response: WebSocketMessage = {
            action: "delay_test_end",
            status: "ok",
            payload: clientId.toString(),
        };

        const ws = clientMap.get(clientId)?.websocket;
        clientMap.get(clientId)!.isTestingDelay = false;
        if (ws) {
            ws.send(encode(response));
        }
    }
}

export { initWebSocketManager };