declare;
('@cmdcode/crypto-tools/keys');
export {};
declare global {
  interface Window {
    cryptoUtils: any;
  }
  interface globalThis {
    cryptoUtils: any;
  }
}
