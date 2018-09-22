import { isObject, noop } from '@ch1/utility';
import { fingerprint } from './browser-dna-express';

describe('Browser DNA Express', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = { body: {}, get: () => 'foo', ip: '6:4' };
    mockRes = { locals: {} };
  });

  describe('fingerprint', () => {
    it('calls next', (done) => {
      fingerprint()(mockReq, mockRes, () => {
        expect(true).toBe(true);
        done();
      });
    });

    it('sets a fingerprint object on locals', () => {
      fingerprint()(mockReq, mockRes, noop);
      expect(isObject(mockRes.locals.fingerprint)).toBe(true);
    });

    it('skips client fingerprints on OPTIONS', () => {
      mockReq.method = 'OPTIONS';
      fingerprint()(mockReq, mockRes, noop);
      expect(isObject(mockRes.locals.fingerprint.client)).toBe(false);
    });

    it('forces DNT to be boolean (false)', () => {
      mockReq.get = () => 0;
      fingerprint()(mockReq, mockRes, noop);
      expect(isObject(mockRes.locals.fingerprint.server.dnt)).toBe(false);
    });

    it('forces DNT to be boolean (true)', () => {
      mockReq.get = () => 1;
      fingerprint()(mockReq, mockRes, noop);
      expect(isObject(mockRes.locals.fingerprint.server.dnt)).toBe(false);
    });

    it('skips client fingerprints if fingerprint prop is NOT on body', () => {
      fingerprint()(mockReq, mockRes, noop);
      expect(isObject(mockRes.locals.fingerprint.client)).toBe(false);
    });

    it('uses client fingerprint if fingerprint is on body', () => {
      mockReq.body.fingerprint = {};
      fingerprint()(mockReq, mockRes, noop);
      expect(isObject(mockRes.locals.fingerprint.client)).toBe(true);
    });

    it('forces client usesCookies to boolean', () => {
      mockReq.body.fingerprint = { usesCookies: 1 };
      fingerprint()(mockReq, mockRes, noop);
      expect(mockRes.locals.fingerprint.client.usesCookies).toBe(true);
    });

    it('forces client usesTouch to boolean', () => {
      mockReq.body.fingerprint = { usesTouch: 1 };
      fingerprint()(mockReq, mockRes, noop);
      expect(mockRes.locals.fingerprint.client.usesTouch).toBe(true);
    });
  });
});
