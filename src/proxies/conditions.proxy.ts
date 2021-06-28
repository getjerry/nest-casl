import { MongoQuery } from '@casl/ability';
import { MongoQueryParser, allParsingInstructions } from '@ucast/mongo';
import { Condition } from '@ucast/mongo2js';
import { createSqlInterpreter, allInterpreters, pg } from '@ucast/sql';

export type SqlConditions = [string, unknown[], string[]];
export class ConditionsProxy {
  constructor(private conditions: MongoQuery[]) {}

  public get(): MongoQuery[] {
    return Object.assign({}, ...this.conditions);
  }

  public toAst(): Condition {
    const parser = new MongoQueryParser(allParsingInstructions);
    return parser.parse(this.get());
  }

  public toSql(): SqlConditions {
    const interpret = createSqlInterpreter(allInterpreters);
    return interpret(this.toAst(), {
      ...pg,
      joinRelation: this.joinRelation,
    });
  }

  public joinRelation(): boolean {
    return false;
  }
}
