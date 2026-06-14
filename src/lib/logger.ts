export const logger = {
  info: (event: string, meta: Record<string, any> = {}) => {
    console.log(JSON.stringify({ level: 'info', event, timestamp: new Date().toISOString(), ...meta }));
  },
  warn: (event: string, meta: Record<string, any> = {}) => {
    console.warn(JSON.stringify({ level: 'warn', event, timestamp: new Date().toISOString(), ...meta }));
  },
  error: (event: string, meta: Record<string, any> = {}) => {
    console.error(JSON.stringify({ level: 'error', event, timestamp: new Date().toISOString(), ...meta }));
  }
};
