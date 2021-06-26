import { ConditionsProxy } from './conditions.proxy';

describe('ConditionsProxy', () => {
  it('translates proxied conditions to parametrized sql', () => {
    const conditionsProxy = new ConditionsProxy([{ userId: 'userId' }]);
    expect(conditionsProxy.toSql()).toEqual(['"userId" = $1', ['userId'], []]);
  });

  it('should not join relations', () => {
    const conditionsProxy = new ConditionsProxy([{ userId: 'userId' }]);
    expect(conditionsProxy.joinRelation()).toBeFalsy();
  });
});
