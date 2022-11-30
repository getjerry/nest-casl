import { AnyAbility, Subject } from '@casl/ability';
import { rulesToAST } from '@casl/ability/extra';
import { Condition, MongoQuery } from '@ucast/mongo2js';
import { createSqlInterpreter, allInterpreters, pg } from '@ucast/sql';
import { AnyMongoAbility } from '@casl/ability';
import { rulesToQuery } from '@casl/ability/extra';

export type SqlConditions = [string, unknown[], string[]];

function convertToMongoQuery(rule: AnyMongoAbility['rules'][number]) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const conditions = rule.conditions!;
  return rule.inverted ? { $nor: [conditions] } : conditions;
}

export class ConditionsProxy {
  constructor(private abilities: AnyAbility, private action: string, private subject: Subject) {}

  public toAst(): Condition | null {
    return rulesToAST(this.abilities, this.action, this.subject);
  }

  public toSql(): SqlConditions | undefined {
    const ast = this.toAst();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (ast === null || !Array.from(ast.value as any).length) return undefined;
    const interpret = createSqlInterpreter(allInterpreters);
    return interpret(ast, {
      ...pg,
      joinRelation: this.joinRelation,
    });
  }

  public joinRelation(): boolean {
    return false;
  }

  public toMongo(): MongoQuery | undefined {
    if (!this.getRules()) return undefined;
    return rulesToQuery(this.abilities, this.action, this.subject, convertToMongoQuery) || undefined;
  }

  public get(): MongoQuery[] {
    return this.getRules().map((r) => r.conditions);
  }

  private getRules() {
    return this.abilities.rulesFor(this.action, this.subject);
  }
}
