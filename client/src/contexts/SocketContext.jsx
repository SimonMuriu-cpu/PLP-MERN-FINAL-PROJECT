import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        setConnected(true);
        console.log('Connected to server');
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
        console.log('Disconnected from server');
      });

      newSocket.on('orderStatusUpdated', (data) => {
        toast.success(`Order ${data.orderId} status updated to ${data.status}`);
      });

      newSocket.on('newOrder', (data) => {
        if (user.role === 'vendor') {
          toast.success(`New order received: ${data.orderId}`);
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const value = {
    socket,
    connected
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};