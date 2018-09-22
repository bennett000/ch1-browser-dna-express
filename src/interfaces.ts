import { Fingerprint as ClientFingerprint } from '@ch1/browser-dna';
export { Fingerprint as ClientFingerprint } from '@ch1/browser-dna';

export interface Fingerprint {
  connection: ConnectionFingerprint;
  client?: ClientFingerprint;
  server: ServerFingerprint;
}

export interface ConnectionFingerprint {
  ip: string;
  referrer: string;
  method: string;
}

export interface ServerFingerprint {
  language: string;
  userAgent: string;
  usesDnt: boolean;
}
