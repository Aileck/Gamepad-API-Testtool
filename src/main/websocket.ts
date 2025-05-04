// Import WebSocket to avoid 
import { WebSocketServer, WebSocket  } from "ws";
import { BrowserWindow, ipcMain } from "electron";
import { networkInterfaces } from 'os';
import { v4 as uuidv4 } from 'uuid'; 

interface WebSocketMessage {
    status: "closed" | "started" | "error";
}

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
        console.log(`WebSocket server started on port ${port}`);
    });

    wss.on('error', (error) => {
        mainWindow?.webContents.send('server-status',
            {
                status: "error",
                error: error.message,
            } as WebSocketMessage
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

        ws.send('Welcome to the Electron WebSocket Server!');
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
            } as WebSocketMessage
        );

        wss = null;
    });
}

function handleWebSocketMessage(ws: WebSocket, message) {
    try {
        const messageString = message.toString();
        const parsedData = JSON.parse(messageString);

        if(parsedData.action === 'register') {
            const clientId = uuidv4(); 

            ws.send(clientId);
        }

    } catch (err) {
        console.error('Failed to parse incoming message as JSON:', err);
        mainWindow?.webContents.send('message-error', {
            error: 'Invalid JSON format',
            rawMessage: message.toString()
        });
        return;
    }
}

export { initWebSocketManager };