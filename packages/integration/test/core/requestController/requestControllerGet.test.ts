import { MoralisCore, RequestController } from '@moralisweb3/core';
import { setupServer, SetupServerApi } from 'msw/node';
import { rest } from 'msw';

const getJsonMock = rest.get(`http://example.com/getJson`, (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      iAm: 'Batman',
    }),
  );
});

const getTextMock = rest.get(`http://example.com/getText`, (req, res, ctx) => {
  return res(ctx.status(200), ctx.text('I am Batman'));
});

const get400ErrorMock = rest.get(`http://example.com/get400Error`, (req, res, ctx) => {
  return res(
    ctx.status(400),
    ctx.json({
      message: 'I am not Batman',
    }),
  );
});

const get404ErrorMock = rest.get(`http://example.com/get404Error`, (req, res, ctx) => {
  return res(
    ctx.status(404),
    ctx.json({
      message: 'I am not Batman',
    }),
  );
});

const get500ErrorMock = rest.get(`http://example.com/get500Error`, (req, res, ctx) => {
  return res(
    ctx.status(500),
    ctx.json({
      message: 'I am not Batman',
    }),
  );
});

const get503ErrorMock = rest.get(`http://example.com/get503Error`, (req, res, ctx) => {
  return res(
    ctx.status(503),
    ctx.json({
      message: 'I am not Batman',
    }),
  );
});

const get400ErrorMultiMessageMock = rest.get(`http://example.com/get400MultiMessageError`, (req, res, ctx) => {
  return res(
    ctx.status(400),
    ctx.json({
      message: ['I am not Batman', 'I am not superman'],
    }),
  );
});

const get400ErrorEmptyJsonMock = rest.get(`http://example.com/get400ErrorEmptyJson`, (req, res, ctx) => {
  return res(ctx.status(400), ctx.json({}));
});

const get400ErrorEmptyMock = rest.get(`http://example.com/get400ErrorEmpty`, (req, res, ctx) => {
  return res(ctx.status(400));
});

const handlers = [
  getJsonMock,
  getTextMock,
  get400ErrorMock,
  get404ErrorMock,
  get500ErrorMock,
  get503ErrorMock,
  get400ErrorMultiMessageMock,
  get400ErrorEmptyJsonMock,
  get400ErrorEmptyMock,
];

describe('RequestControllerGet', () => {
  let requestController: RequestController;
  let mockServer: SetupServerApi;

  beforeAll(() => {
    const core = MoralisCore.create();
    requestController = RequestController.create(core);

    mockServer = setupServer(...handlers);
    mockServer.listen({
      onUnhandledRequest: 'warn',
    });
  });

  afterAll(() => {
    mockServer.close();
  });

  beforeEach(() => {});

  it('should get a valid Json response', async () => {
    const result = await requestController.get('http://example.com/getJson');

    expect(result).toStrictEqual({ iAm: 'Batman' });
  });

  it('should get a valid text response', async () => {
    const result = await requestController.get('http://example.com/getText');

    expect(result).toStrictEqual('I am Batman');
  });

  it('should throw an error on 400 response', async () => {
    expect(requestController.get('http://example.com/get400Error')).rejects.toThrowError(
      '[C0006] Request failed with status 400: I am not Batman',
    );
  });

  it('should throw an error on 404 response', async () => {
    expect(requestController.get('http://example.com/get404Error')).rejects.toThrowError(
      '[C0006] Request failed with status 404: I am not Batman',
    );
  });

  it('should throw an error on 500 response', async () => {
    expect(requestController.get('http://example.com/get500Error')).rejects.toThrowError(
      '[C0006] Request failed with status 500: I am not Batman',
    );
  });

  it('should throw an error on 503 response', async () => {
    expect(requestController.get('http://example.com/get503Error')).rejects.toThrowError(
      '[C0006] Request failed with status 503: I am not Batman',
    );
  });

  it('should handle multiple messages in an error response', async () => {
    expect(requestController.get('http://example.com/get400MultiMessageError')).rejects.toThrowError(
      '[C0006] Request failed with status 400: I am not Batman, I am not superman',
    );
  });

  it('should handle empty error response', async () => {
    expect(requestController.get('http://example.com/get400ErrorEmptyJson')).rejects.toThrowError(
      '[C0006] Request failed with status 400: Unknown error (no error info returned from API)',
    );
  });

  it('should handle empty error response', async () => {
    expect(requestController.get('http://example.com/get400ErrorEmpty')).rejects.toThrowError(
      '[C0006] Request failed with status 400: Unknown error (no error info returned from API)',
    );
  });
});
