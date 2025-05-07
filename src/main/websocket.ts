// Import WebSocket to avoid 
import { WebSocketServer, WebSocket  } from "ws";
import { encode, decode } from '@msgpack/msgpack';
import { BrowserWindow, ipcMain } from "electron";
import { networkInterfaces } from 'os';
import { initializeGamepadSystem, createGamepad } from './gamepadFactory'
import { GamepadType } from '../shared/types';
import { xbox } from "./ffi";

interface WebSocketMessage {
    action: "handshake_ack" | "register_ack" | "error";
    status: "ok" | "error";
    payload: string;
}

interface ServerStatus {
    status: "closed" | "started" | "error";
    message?: string;
}

type WebSocketPayload = {
    action: string;
    id?: string;
    gamepadType: string;
    gamepadData?: any;
};

let wss: WebSocketServer | null = null;
let mainWindow: BrowserWindow | null = null;
let port: number = 8080; // Default port

// Store all active communications in a Set
const connections = new Set<WebSocket>(); 

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
            handleWebSocketMessage(ws, message);
        });

        ws.on('close', () => {
            connections.delete(ws);

            mainWindow?.webContents.send('client-disconnected', {
                ip: clientIp,
                totalConnections: connections.size,
            });

            console.log(`Client disconnected: ${clientIp}`);
        });

        // ws.send(encode('Welcome to the Electron WebSocket Server!'));
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

async function handleWebSocketMessage (ws: WebSocket, message) {
    try {
        const decoded = decode(message) as WebSocketPayload;
        console.log('Received message:', decoded);

        if(decoded?.action === 'handshake') {
            const response: WebSocketMessage = {
                action: "handshake_ack",
                status: "ok",
                payload: "ok",
            };

            ws.send(encode(response));
        } else if(decoded?.action === 'register') {
            const clientId = await createGamepad(decoded.gamepadType as GamepadType); 
            const response: WebSocketMessage = {
                action: "register_ack",
                status: "ok",
                payload: clientId.toString(),
            };
            console.log('Registering gamepad:', decoded.gamepadType, clientId);
            ws.send(encode(response));
        } else if(decoded?.action === 'input') {
            // const { id, gamepadType, gamepadData } = decoded;
            // xbox

        } else {
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
        return;
    }
}

export { initWebSocketManager };