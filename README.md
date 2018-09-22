# CH1 Browser DNA

[![CircleCI](https://circleci.com/gh/bennett000/ch1-browser-dna-express.svg?style=svg)](https://circleci.com/gh/bennett000/ch1-browser-dna-express)

_This is not well maintained_

## Installation

`yarn add @ch1/browser-dna-express`

## What is This

Fingerprinting middleware for express. This middleware grabs information
about a connection and puts it on the `res.locals` object of each request.
Consumers will need to use some other middleware to store this.

The middleware also consumes request body's that have a fingerprint object
that comes from [@ch1/browser-dna](https://www.npmjs.com/package/@ch1/browser-dna 'Browser fingerprinting library')

## Morality of Browser Fingerprinting

Fingerprinting can be a hot button topic and for good reason. Privacy on
the internet is an illusion. We should expect some modicum of privacy but
we should also be aware of the limitations of the tools we use. This library
and other - more robust - libraries like [Panopticlick](https://github.com/EFForg/panopticlick-python 'Panopticlick EFF')
show just how much trivial seeming data we give away that actually "marks"
us.

Ultimately your fingerprint from a library like this, in combination with an
IP address is not _really_ enough to uniquely identify most people but it
_really_ shrinks the pool, especially in certain areas.

### Why Would We Want This?

While we want and should have privacy there is a strong use case for having
our connections be semi-identifiable.

Consider the following:

- You run a web service of some sort
- You're getting a _lot_ of connections from one IP
- The IP represents a huge institution that has a lot of legitimate users
  but due to NAT they all appear as one user

This is where at least fingerprinting headers and connection detail server
side helps.

Another case would be implementing an app that uses semi-anonymous sharing
having a JS + server side fingerprint would allow the app to _somewhat_
distinguish anonymous connections for the purpose of say short term chat.

## Usage

Use at the top level of an express app

```ts
import { fingerprint } from '@ch1/browser-dna-express';

// where app is your express app
app.use(fingerprint());

// then on the next middleware
app.use((req: Request, res: Response, next: Function) => {
  console.log(JSON.stringify(res.locals.fingerprint, null, 2));
  next();
});
```

The `res.locals.fingerprint` object is populated as follows:

```ts
export interface Fingerprint {
  connection: ConnectionFingerprint;
  client?: ClientFingerprint;
  server: ServerFingerprint;
}
```

The client fingerprint is optional and will only be present if the client
has forwarded the information. The client can easily harvest the information
with [@ch1/browser-dna](https://www.npmjs.com/package/@ch1/browser-dna 'Browser fingerprinting client')
the consumer would need to create a `ClientFingerprint` on the client and
send it to the server in the body using the property fingerprint:

```ts
interface RequestBody {
  [key: string]: any;
  fingerprint: ClientFingerprint;
}
```

### Okay Now What?

With the fingerprint data the next step would be to use another middleware
_after_ this middleware to store the fingerprint information somewhere

## License

[LGPL](./LICENSE 'Lesser GNU Public License')
