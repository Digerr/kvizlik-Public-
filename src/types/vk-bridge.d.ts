declare module '@vkontakte/vk-bridge' {
  interface VKBridgeEvent {
    type: string;
    data?: Record<string, any>;
  }

  interface VKBridge {
    send: (method: string, params?: Record<string, any>) => Promise<any>;
    subscribe: (fn: (event: VKBridgeEvent) => void) => void;
    unsubscribe: (fn: (event: VKBridgeEvent) => void) => void;
    supports: (method: string) => boolean;
  }

  const bridge: VKBridge;
  export default bridge;
}
