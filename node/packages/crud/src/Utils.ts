import * as changeCase from "change-case";
import * as path from "path";
import * as packagejson from "../package.json";
import { Entity } from "./models/Entity";

export function LogError(
    errText: string,
    isABug = true,
    passedError?: string | ErrorConstructor
): void {
    let errObject = passedError;
    console.error(errText);
    console.error(`${packageVersion()}  node@${process.version}`);
    if (isABug && !passedError) {
        errObject = new Error().stack;
    }
    if (errObject) {
        console.error(errObject);
    }
}
export function packageVersion(): string {
    return `${packagejson.name}@${packagejson.version}`;
}
export function findNameForNewField(
    _fieldName: string,
    entity: Entity,
    columnOldName = ""
): string {
    let fieldName = _fieldName;

    // 预计算现有名称的 Set，避免每次迭代重复遍历
    const existingNames = new Set<string>();
    const normalizedOldName = columnOldName ? changeCase.camelCase(columnOldName) : '';
    entity.columns.forEach(v => existingNames.add(changeCase.camelCase(v.tscName)));
    entity.relations.forEach(v => existingNames.add(changeCase.camelCase(v.fieldName)));
    entity.relationIds.forEach(v => existingNames.add(changeCase.camelCase(v.fieldName)));

    const isValid = (name: string) =>
        !existingNames.has(name) ||
        (normalizedOldName && normalizedOldName === name);

    if (!isValid(changeCase.camelCase(fieldName))) {
        fieldName += "_";
        const maxIterations = entity.columns.length + entity.relations.length;
        for (let i = 2; i <= maxIterations; i++) {
            fieldName =
                fieldName.substring(0, fieldName.length - i.toString().length) +
                i.toString();
            if (isValid(changeCase.camelCase(fieldName))) {
                break;
            }
        }
    }
    return fieldName;
}

export function requireLocalFile(fileName: string): any {
    try {
        // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
        return require(fileName);
    } catch (err) {
        if (!path.isAbsolute(fileName)) {
            // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
            return require(path.resolve(process.cwd(), fileName));
        }
        throw err;
    }
}
export function parseName(name: string, type: number = 1, ucfirst: boolean = true): string {
  if (type === 1) {
    // C 风格（user_name） → Java 风格（userName / UserName）
    const camel = name.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    if (ucfirst) {
      return camel.charAt(0).toUpperCase() + camel.slice(1);
    } else {
      return camel.charAt(0).toLowerCase() + camel.slice(1);
    }
  } else {
    // Java 风格（userName） → C 风格（user_name）
    // 在大写字母前加下划线，并转为小写
    const snake = name.replace(/([A-Z])/g, '_$1').toLowerCase();
    // 去除首尾可能的下划线
    return snake.replace(/^_+|_+$/g, '');
  }
}