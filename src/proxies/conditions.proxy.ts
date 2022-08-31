import { AnyAbility, Subject } from '@casl/ability';
import { rulesToAST } from '@casl/ability/extra';
import { Condition } from '@ucast/mongo2js';
import { createSqlInterpreter, allInterpreters, pg } from '@ucast/sql';

export type SqlConditions = [string, unknown[], string[]];
export class ConditionsProxy {
  constructor(private abilitites: AnyAbility, private action: string, private subject: Subject) {}

  public toAst(): Condition | null {
    return rulesToAST(this.abilitites, this.action, this.subject);
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
}
