import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ContextProxy } from './context.proxy';

describe('ContextProxy', () => {
  it('should get request from http context', async () => {
    const req = new Object();
    const context = new ExecutionContextHost([req, undefined, {}]);
    context.getType = jest.fn().mockImplementation(() => 'http');
    const contextProxy = ContextProxy.create(context);
    expect(await contextProxy.getRequest()).toEqual(req);
  });

  it('should get request from graphql context', async () => {
    const req = new Object();
    const context = new ExecutionContextHost([{}, undefined, { req }, undefined]);
    context.getType = jest.fn().mockImplementation(() => 'graphql');
    const contextProxy = ContextProxy.create(context);
    expect(await contextProxy.getRequest()).toEqual(req);
  });
  
  it('should get request from ws context', async () => {
    const req = new Object();
    const context = new ExecutionContextHost([{}, undefined, { req }]);
    context.getType = jest.fn().mockImplementation(() => 'ws');
    const contextProxy = ContextProxy.create(context);
    expect(await contextProxy.getRequest()).toEqual(req);
  });

  it('should throw error for rpc context', async () => {
    const req = new Object();
    const context = new ExecutionContextHost([{}, undefined, { req }]);
    context.getType = jest.fn().mockImplementation(() => 'rpc');
    const contextProxy = ContextProxy.create(context);
    expect(() => contextProxy.getRequest()).rejects.toThrowError();
  });
});
