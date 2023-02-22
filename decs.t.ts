// m3u8 default import includes a createReadStream method, it has a .on and .once
// returns a object with createStream method, it has a .on and .once
declare module 'm3u8' {
  // Declare the types for the functions and properties you are using
  export function createStream(): {
    on: (event: string, callback: (item: any) => void) => void;
    once: (event: string, callback: (item: any) => void) => void;
  };
}
