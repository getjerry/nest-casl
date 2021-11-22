import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ContextProxy } from './context.proxy';

describe('ContextProxy', () => {
  it('should get request from http context', () => {
    const req = new Object();
    const context = new ExecutionContextHost([req, undefined, {}]);
    context.getType = jest.fn().mockImplementation(() => 'http');
    const contextProxy = ContextProxy.create(context);
    expect(contextProxy.getRequest()).toEqual(req);
  });

  it('should get request from graphql context', () => {
    const req = new Object();
    const context = new ExecutionContextHost([{}, undefined, { req }]);
    context.getType = jest.fn().mockImplementation(() => 'graphql');
    const contextProxy = ContextProxy.create(context);
    expect(contextProxy.getRequest()).toEqual(req);
  });
  
  it('should get request from ws context', () => {
    const req = new Object();
    const context = new ExecutionContextHost([{}, undefined, { req }]);
    context.getType = jest.fn().mockImplementation(() => 'ws');
    const contextProxy = ContextProxy.create(context);
    expect(contextProxy.getRequest()).toEqual(req);
  });

  it('should throw error for rpc context', () => {
    const req = new Object();
    const context = new ExecutionContextHost([{}, undefined, { req }]);
    context.getType = jest.fn().mockImplementation(() => 'rpc');
    const contextProxy = ContextProxy.create(context);
    expect(() => contextProxy.getRequest()).toThrowError();
  });
});
