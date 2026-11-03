const Logger = {
  log: (message: string, data?: any) => {
    console.log(`[LOG] ${message}`, data || '');
  },
  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  },
};

export default Logger;
