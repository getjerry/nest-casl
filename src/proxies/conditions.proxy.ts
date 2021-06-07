import { MongoQuery } from '@casl/ability';
import { MongoQueryParser, allParsingInstructions } from '@ucast/mongo';
import { createSqlInterpreter, allInterpreters, pg } from '@ucast/sql';

export class ConditionsProxy {
  constructor(private conditions: MongoQuery[]) {}

  public get() {
    return Object.assign({}, ...this.conditions);
  }

  public toAst() {
    const parser = new MongoQueryParser(allParsingInstructions);
    return parser.parse(this.get());
  }

  public toSql(dialect = 'pg') {
    const interpret = createSqlInterpreter(allInterpreters);
    return interpret(this.toAst(), {
      ...pg,
      joinRelation: () => false,
    });
  }
}
