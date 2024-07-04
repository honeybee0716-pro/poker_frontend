import { createContext, useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useSelector } from 'src/store';
import { SocketContextType } from 'src/types';
import { WEBSOCKET_URL } from 'src/config-global';

type ISocket = {
  key: string;
  socketKey: string;
  connectionId: number;
};

const SocketContext = createContext<SocketContextType | null>(null);
/* eslint-disable */
export const SocketProvider = ({ children }: { children: React.ReactElement }) => {
  const [socketKey, setSocketKey] = useState<string>('');
  const [connectionId, setConnectionId] = useState<number>(-1);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
    share: false,
    shouldReconnect: () => true,
  });

  const sendSocket = (data: { [key: string]: any }) => {
    if (socketKey && connectionId !== -1) sendJsonMessage({ ...data, socketKey, connectionId });
    else {
      console.error('SocketKey is required');
    }
  };

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    if (!lastJsonMessage) return;
    const { socketKey, connectionId } = lastJsonMessage as ISocket;

    if (socketKey && connectionId) {
      console.log('Web socket connected!');
      setSocketKey(socketKey);
      setConnectionId(connectionId);
    }
  }, [lastJsonMessage]);

  return (
    <SocketContext.Provider
      value={{
        sendSocket,
        connectionId,
        lastJsonMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
