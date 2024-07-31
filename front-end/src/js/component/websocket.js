// 建立websocket通信
// 创建一个 WebSocket 连接
export function setupWebSocket() {

    try{
        const socket = new WebSocket('ws://localhost:3020');
    
        // 发生错误时的事件处理
        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return {'socket': socket, 'error': null};
    }catch(error){
        console.error('WebSocket error:', error);
        return {'socket': null, 'error': error};
    }
};