import { Response } from 'express';
import {
  noop,
  toGtZeroIntMax,
  toString,
  toStringArrayMax,
  toStringMax
} from '@ch1/utility';
import {
  ClientFingerprint,
  ConnectionFingerprint,
  FingerprintedRequest,
  ServerFingerprint
} from './interfaces';

export function fingerprint() {
  return (req: FingerprintedRequest, res: Response, next: Function) => {
    connectionFingerprint(req, res, noop);
    serverFingerprint(req, res, noop);

    if (req.method !== 'OPTIONS') {
      clientFingerprint(req, res, noop);
    }

    next();
  };
}

export function connectionFingerprint(
  req: FingerprintedRequest,
  res: Response,
  next: Function
) {
  const connectionFingerprint: ConnectionFingerprint = {
    ip: cleanExpressIp(req.ip),
    referrer: toStringMax(2000, req.get('Referer')),
    method: toStringMax(16, req.method)
  };

  req.fingerprint = req.fingerprint || {};
  req.fingerprint.connection = connectionFingerprint;

  res.locals.fingerprint = res.locals.fingerprint || {};
  res.locals.fingerprint.connection = connectionFingerprint;

  next();
}

export function serverFingerprint(
  req: FingerprintedRequest,
  res: Response,
  next: Function
) {
  const serverFingerprint: ServerFingerprint = {
    language: toStringMax(64, req.get('Accept-Language')),
    userAgent: toStringMax(512, req.get('User-Agent')),
    usesDnt: parseInt(toString(req.get('DNT')), 10) ? true : false
  };

  req.fingerprint = req.fingerprint || {};
  req.fingerprint.server = serverFingerprint;

  res.locals.fingerprint = res.locals.fingerprint || {};
  res.locals.fingerprint.server = serverFingerprint;

  next();
}

export function clientFingerprint(
  req: FingerprintedRequest,
  res: Response,
  next: Function
) {
  if (!req.body.fingerprint) {
    next();
    return;
  }

  const fp = req.body.fingerprint;

  const clientFingerprint: ClientFingerprint = {
    browserDepth: toGtZeroIntMax(50000, fp.browserDepth),
    browserHeight: toGtZeroIntMax(50000, fp.browserHeight),
    browserWidth: toGtZeroIntMax(50000, fp.browserWidth),
    concurrency: toGtZeroIntMax(512, fp.concurrency),
    os: toStringMax(32, fp.os),
    plugins: toStringArrayMax(25, fp.plugins),
    tzOffset: parseInt(fp.tzOffset, 10),
    usesCookies: fp.usesCookies ? true : false,
    usesTouch: fp.usesTouch ? true : false
  };

  req.fingerprint = req.fingerprint || {};
  req.fingerprint.client = clientFingerprint;

  res.locals.fingerprint = res.locals.fingerprint || {};
  res.locals.fingerprint.client = clientFingerprint;

  next();
}

export function cleanExpressIp(ip: string): string {
  const splits = ip.split(':').filter(Boolean);
  return splits[splits.length - 1];
}
