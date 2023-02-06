const net = require('net');

function makeGwSocketMessage(string) {
    let mBuf = Buffer.from(string, 'UTF-8');
    let lBuf = Buffer.allocUnsafe(4);
    lBuf.writeIntBE(mBuf.length, 0, 4);
    return Buffer.concat([lBuf, mBuf], mBuf.length + lBuf.length);
}

function responseParser(socket, data) {
    let buf = Buffer.from(data);
    if(!socket.chunk) {
        socket.chunk = {
            messageSize: 0,
            buffer: Buffer.alloc(0),
            bufferStack: Buffer.alloc(0)
        }
    }

    socket.chunk.bufferStack = Buffer.concat([socket.chunk.bufferStack, data]);

    let reCheck = false;
    let message = '';
    do {
        reCheck = false;
        //if message size == 0 you got a new message so read the message size (first 4 bytes)
        if (socket.chunk.messageSize == 0 && socket.chunk.bufferStack.length >= 4) {
            socket.chunk.messageSize = socket.chunk.bufferStack.readInt32BE(0);
        }

        //After read the message size (!= 0) and the bufferstack is completed and/or the incoming data contains more data (the next message)
        if (socket.chunk.messageSize != 0 && socket.chunk.bufferStack.length >= socket.chunk.messageSize + 4) {
            var buffer = socket.chunk.bufferStack.slice(4, socket.chunk.messageSize + 4);
            socket.chunk.messageSize = 0;
            socket.chunk.bufferStack = socket.chunk.bufferStack.slice(buffer.length + 4);
            message = JSON.parse(buffer.toString());
            //if the stack contains more data after read the entire message, maybe you got a new message, so it will verify the next 4 bytes and so on...
            reCheck = socket.chunk.bufferStack.length > 0;
        }
    } while (reCheck);
    return message;
}

module.exports = {

    getInstance: (protocol, callback, errorFunc) => {
        function Instance() {
            const socket = new net.Socket();
            let error;
            let obj = {
                isFirst: true,
                message: ''
            }

            socket.on('data', function(chunk) {
                let res = responseParser(socket, chunk);
                if(res.Result == 0) {
                    logger.error('[' + protocol + '] Received response: Fail'
                                 + '\n    [ErrorCode]' + res.ErrorCode
                                 + '\n    [Response]' + JSON.stringify(res));
                } else if(res.Result == 1) {
                    callback(res);
                    logger.info('[' + protocol + '] Received response: Success'
                            + '\n    [Response] ' + JSON.stringify(res));
                } else {
                    logger.error('[' + protocol + '] Received response: Success but empty message'
                            + '\n    [Response] ' + JSON.stringify(res));
                }
                setTimeout(() => {
                    socket.destroy();
                }, 1000*10)
            });
            socket.on('timeout', function() {
                logger.info('[' + protocol + '] Socket timeout');
                errorFunc();
            });
            socket.on('end', function() {
                logger.info('[' + protocol + '] Socket disconnected');
            });
            socket.on('error', function(e) {
                logger.error('[' + protocol + '] Error in socket communication'
                            + '\n    [Error] ' + JSON.stringify(e));
                error = e;
            });
            socket.on('close', function(isError) {
                let message = '[' + protocol + '] Socket closed'
                            + '\n    [IsError] ' + isError;
                if(isError) {
                    logger.error(message);
                    errorFunc(error);
                } else {
                    logger.info(message);
                }
            })

            this.connect = () => {
                return new Promise((resolve, reject) => {
                    try {
                        socket.connect({host:SERVER_CONFIG.CR.IP, port:SERVER_CONFIG.CR.PORT}, function() {
                            this.setTimeout(SERVER_CONFIG.CR.TIME_OUT);

                            logger.info('[' + protocol + '] Socket connected');
                            resolve();
                        });
                    } catch(e) {
                        reject(e);
                    }
                })
            }

            this.write = (payloadJson) => {
                let payloadJsonStr = JSON.stringify(payloadJson);
                let payload = makeGwSocketMessage(payloadJsonStr);
                logger.info('[' + protocol + '] Writing payload'
                            + '\n    [Payload] ' + payloadJsonStr);
                let success = !socket.write(payload);
                if(!success){
                    (function(socket, payload){
                        socket.once('drain', function(){
                            writeData(socket, payload);
                        });
                    })(socket, payload);
                }
            }

            this.disconnect = () => {
                socket.destroy();
            }
        }
        return new Instance();
    }

}