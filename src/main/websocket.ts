// Import WebSocket to avoid 
import { WebSocketServer, WebSocket  } from "ws";
import { BrowserWindow, ipcMain } from "electron";
// 添加 os 模块用于获取网络接口信息
import { networkInterfaces } from 'os';

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
            const messageString = message.toString();

            mainWindow?.webContents.send('message-received', messageString);
            console.log(`Received message from ${clientIp}: ${message}`);
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

export { initWebSocketManager };