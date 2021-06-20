import { ConditionsProxy } from './conditions.proxy';

describe('ConditionsProxy', () => {
  it('translates proxied conditions to paramaetrized sql', () => {
    const conditionsProxy = new ConditionsProxy([{ userId: 'userId' }]);
    expect(conditionsProxy.toSql()).toEqual(['"userId" = $1', ['userId'], []]);
  });
});
