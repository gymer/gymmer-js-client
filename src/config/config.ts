export default {
  SERVICE_MESSAGES_PREFIX: "gymmer:",
  SOCKET_RESTORE_TIMEOUT: 2000,
  DEFAULT_OPTIONS: {
    wsUrl: "ws://localhost:8000/ws",
    auth: {
      url: "/pusher/auth",
      method: "POST"
    }
  }
};
