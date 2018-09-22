import { Fingerprint as ClientFingerprint } from '@ch1/browser-dna';
export { Fingerprint as ClientFingerprint } from '@ch1/browser-dna';
import { Request } from 'express';
export { Request } from 'express';

export interface FingerprintedRequest extends Request {
  fingerprint: Fingerprint;
}

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
