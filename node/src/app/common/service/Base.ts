import { Equal, Like, In, Between, Not, MoreThan, LessThan, MoreThanOrEqual, LessThanOrEqual, Repository, QueryRunner, SelectQueryBuilder } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import _ from 'lodash';
import { TypeORMDataSourceManager } from '@midwayjs/typeorm';
import { Inject, Provide } from '@midwayjs/core';

@Provide()
export abstract class Base {
    //是否开启软删除
    protected softDelete: boolean = true;
    protected abstract model: Repository<any>;
    protected abstract selectFields: string[];
    protected join?: selectJoin[];
    protected error: string = '';
    // @ts-ignore
    protected abstract filterWhere();
    protected rootAlias = 'a';
    @Inject()
    protected dataSourceManager: TypeORMDataSourceManager;
    public async index(param?: any, join?: selectJoin[] | Boolean): Promise<any> {
        join = this.getJoin(join);
        const alia = _.isEmpty(join) ? '' : this.rootAlias;
        const queryBuilder = this.model.createQueryBuilder(alia);
        const where = this.buildWhereString(param, alia);
        const order = this.buildOrder(param, alia);
        const { skip, take } = this.getPage(param);
        if (!_.isEmpty(join)) {
            this.buildJoins(queryBuilder, join);
        }
        if (false !== where) {
            queryBuilder.where(where.where, where.parameters);
        }
        if (!_.isEmpty(order)) {
            queryBuilder.orderBy(order);
        }
        queryBuilder.skip(skip).take(take);
        const [data, count] = await queryBuilder.getManyAndCount();
        return {
            data,
            current_page: param.page || 1,
            per_page: take,
            total: count,
            last_page: Math.max(Math.ceil(count / take), 1),
        };
    }
    public async detail(param?: any, join?: selectJoin[] | Boolean) {
        join = this.getJoin(join)
        const alia = _.isEmpty(join) ? '' : this.rootAlias;
        const queryBuilder = this.model.createQueryBuilder(alia);
        const where = this.buildWhereString(param, alia);
        if (!_.isEmpty(join)) {
            this.buildJoins(queryBuilder, join);
        }
        if (false !== where) {
            queryBuilder.where(where.where, where.parameters);
        }
        return await queryBuilder.getOne();
    }
    public async save(param?: any, join?: selectJoin[] | Boolean) {
        return await this.transaction("READ COMMITTED", async (queryRunner: QueryRunner) => {
            const repo = queryRunner.manager.getRepository(this.model.target);
            param = await this.processManyToManyRelations(param);
            const data = await repo.save(param);
            return data;
        })
    }
    public async add(params?: any, join?: selectJoin[] | Boolean) {
        return this.save(params, join);
    }
    public async update(param?: any, join?: selectJoin[] | Boolean): Promise<any> {
        if (_.isEmpty(param)) {
            throw new Error("参数不能为空");
        }
        return await this.transaction("READ COMMITTED", async (queryRunner: QueryRunner) => {
            const repo = queryRunner.manager.getRepository(this.model.target);
            const entity = await repo.findOneBy({ [this.getPrimaryKey()]: param.id });
            if (!entity) return null;
            if (param.id) {
                delete param.id;
            }
            param = await this.processManyToManyRelations(param);
            Object.assign(entity, param);
            return await repo.save(entity);
        })
    }
    /**
     * 处理多对多关联数据
     * @returns 
     */

    protected async processManyToManyRelations(param: any) {
        this.model.metadata.relations.forEach(relation => {
            const propertyName = relation.propertyName;
            if (relation.isManyToMany && !_.isEmpty(param[propertyName])) {
                const value = param[propertyName];
                if (Array.isArray(value) && value.length > 0) {
                    param[propertyName] = value.map(id => ({ id }));
                }
            }
        });
        return param;
    }
    /**
     * 获取关联关系
     * @param entity 
     * @returns 
     */
    public getRelations(entity?: Repository<any>) {
        const model = entity || this.model;
        const relations = model.metadata.relations;
        return relations.map(item => {
            return {
                name: item.propertyName,
                //@ts-ignore
                type: item.relationType,
            }
        });
    }
    public async delete(param?: any, join?: selectJoin[]): Promise<any> {
        return await this.transaction("READ COMMITTED", async (queryRunner: QueryRunner) => {
            const repo = queryRunner.manager.getRepository(this.model.target);
            const relations = this.model.metadata.relations;
            for (const relation of relations) {
                if (relation.isManyToMany) {  // 处理多对多关联 只删除中间表数据
                    const junctionMetadata = relation.junctionEntityMetadata;
                    if (junctionMetadata) {
                        const junctionTable = junctionMetadata.tableName;
                        const column = relation.isOwning
                            ? relation.joinColumns[0].databaseName
                            : relation?.inverseRelation?.joinColumns[0].databaseName;
                        await queryRunner.manager
                            .createQueryBuilder()
                            .delete()
                            .from(junctionTable)
                            .where(`${column} IN (:...ids)`, { ids: param.id })
                            .execute();
                    }
                } else if (relation.isOneToMany) {// 处理一对多关联 删除全部
                    const inverseEntity = relation.inverseEntityMetadata.target;
                    const inverseRelation = relation.inverseRelation;
                    if (inverseRelation) {
                        const foreignKeyColumn = inverseRelation.joinColumns[0].databaseName;
                        const inverseRepo = queryRunner.manager.getRepository(inverseEntity);
                        await inverseRepo
                            .createQueryBuilder()
                            .delete()
                            .where(`${foreignKeyColumn} IN (:...ids)`, { ids: param.id })
                            .execute();
                    }
                } else if (relation.isOneToOne) {// 处理一对一关联 删除关联
                    const inverseMetadata = relation.inverseEntityMetadata;
                    if (inverseMetadata.name !== "Uploads") {
                        const foreignKeyColumn = relation.joinColumns[0].databaseName;
                        const inverseRepo = queryRunner.manager.getRepository(
                            inverseMetadata.target
                        );
                        await inverseRepo
                            .createQueryBuilder()
                            .delete()
                            .where(`${foreignKeyColumn} IN (:...ids)`, { ids: param.id })
                            .execute();
                    }
                }
            }
            await repo.remove(this.buildWhere(param));
        })
    }

    public async increment(id: number, fieldName: string, step: number = 1): Promise<any> {
        return await this.model.increment({ id }, fieldName, step);
    }
    public async decrement(id: number, fieldName: string, step: number = 1): Promise<any> {
        return await this.model.decrement({ id }, fieldName, step);
    }

    public getJoin(join: selectJoin[] | Boolean | undefined): selectJoin[] {
        if (false === join) {
            return [] as selectJoin[];
        } else {
            return _.isEmpty(join) ? this.join as selectJoin[] : join as selectJoin[];
        }
    }
    /**
     * 获取主键
     */
    public getPrimaryKey(entity?: Repository<any>): string {
        const model = entity || this.model;
        return model.metadata.primaryColumns[0].propertyName;
    }

    public async select(param?: any) {
        if(param.search){
            param[this.selectFields[1]] = param.search;
        }
        const query = this.model.createQueryBuilder()
            .select(this.selectFields[0], 'value')
            .addSelect(this.selectFields[1], 'label')
        const where = this.buildWhere(param);
        const order = this.buildOrder(param);
        let pageSize = param.pageSize || 100;
        if (pageSize > 500) {
            pageSize = 500;
        }
        if (!_.isEmpty(where)) {
            query.where(where);
        }
        if (!_.isEmpty(order)) {
            query.orderBy(order);
        }
        let data = await query.limit(pageSize).getRawMany();
        return {
            data,
            current_page: param.page || 1,
            per_page: pageSize,
            total: 1,
            last_page: 1,
        };
    }

    /**
     * 开启事务
     * @param isolationLevel 隔离级别
     * @param DataSource 连接名
     * @returns 
     */
    public async starTransaction(isolationLevel: IsolationLevel, DataSource: string = 'default') {
        const dataSource = await this.dataSourceManager.getDataSource(DataSource);
        if (!dataSource?.isInitialized) {
            throw new Error('DataSource is not initialized');
        }
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction(isolationLevel);
        return queryRunner;
    }


    /**
     * 通用数据分配方法
     * @param targetList 目标数组 
     * @param lookupKey 目标数组中用于关联的字段名（如 'id'）
     * @param sourceList 批量查询到的源数据数组（如 logs）
     * @param sourceKey 源数据中用于匹配的字段名（如 'user_id'）
     * @param targetField 要将源数据分配到目标数组的哪个字段（如 'videoInfo'）
     */
    public assignDataToTarget(targetList: any[], lookupKey: string, sourceList: any[], sourceKey: string, targetField: string) {
        if (!targetList || !sourceList || sourceList.length === 0) return;

        // 建立源数据的 Map 映射，避免双重循环带来的 O(n*m) 复杂度
        const sourceMap = new Map(sourceList.map(item => [item[sourceKey], item]));

        for (const target of targetList) {
            const key = target[lookupKey];
            if (key && sourceMap.has(key)) {
            target[targetField] = sourceMap.get(key);
            }
        }
    }

    /**
     * 事务
     * @param callback 回调函数
     * @param isolationLevel 隔离级别
     * @returns 
     */
    public async transaction<T>(isolationLevel: IsolationLevel, callback: (queryRunner: QueryRunner) => Promise<T>) {
        const queryRunner = await this.starTransaction(isolationLevel);
        try {
            const result = await callback(queryRunner);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
    protected getPage(param?: any) {
        let { page = 1, pageSize = 15 } = param;
        page = Math.max(1, page);
        pageSize = parseInt(pageSize) ? parseInt(pageSize) : 15;
        if (pageSize > 100) {
            pageSize = 100;
        }
        return { skip: (page - 1) * pageSize, take: pageSize };
    }
    protected buildJoins(queryBuilder: SelectQueryBuilder<any>, join: selectJoin[]) {
        if (_.isEmpty(join)) {
            return;
        }
        join.forEach((item, index) => {
            const { name, type, alia, condition } = item;
            let aliaName = alia || `j${index}`;
            if (type == 'left') {
                queryBuilder.leftJoinAndSelect(`a.${name}`, aliaName, condition);
            } else {
                queryBuilder.innerJoinAndSelect(`a.${name}`, aliaName, condition);
            }
        });
        return queryBuilder;
    }

    /**
     * 根据参数构建 TypeORM 查询条件
     * @param param 包含查询键值对的对象
     * @param alias 可选的表别名，用于构建关联查询字段
     * @returns 返回一个包含 TypeORM 操作符的对象，用于 where 子句
     */
    protected buildWhere(param?: any, alias: string = ''): Record<string, any> {
        const allowedFieldTypes: Record<string, string[]> = this.filterWhere();
        if (_.isEmpty(allowedFieldTypes)) {
            return {};
        }
        const fieldNameToOperatorMap = new Map<string, string>();
        Object.entries(allowedFieldTypes).forEach(([operatorType, fieldNames]) => {
            fieldNames.forEach(fieldName => {
                fieldNameToOperatorMap.set(fieldName, operatorType);
            });
        });

        if (fieldNameToOperatorMap.size === 0) {
            return {};
        }

        if(this.softDelete && !Object.hasOwn(param,'is_delete')){
            param.is_delete = 0;
        }

        const conditions: Record<string, any> = {};
        for (const [rawKey, rawValue] of Object.entries(param ?? {})) {
            if (rawValue === '' || rawValue === null || rawValue === undefined) {
                continue;
            }
            let processedKey = rawKey;
            let processedValue = rawValue;
            if (processedKey.endsWith('[]')) {
                processedKey = processedKey.slice(0, -2); // 移除末尾的 "[]"
            }
            if (typeof processedValue === 'string' && processedValue.includes(',')) {
                processedValue = processedValue.split(',').map(v => v.trim()); // 添加 trim 清理空格
            }
            const operatorType = fieldNameToOperatorMap.get(processedKey);
            if (!operatorType) {
                // 字段不在白名单内，跳过处理
                continue;
            }
            let finalKeyName = processedKey;
            if (alias && !processedKey.includes('.')) {
                finalKeyName = `${alias}.${processedKey}`;
            }
            const queryCondition = this.createQueryCondition(operatorType, processedValue);

            if (queryCondition !== undefined) {
                conditions[finalKeyName] = queryCondition;
            }
        }
        return conditions;
    }
    protected createQueryCondition(operatorType: string, value: any) {
        switch (operatorType) {
            case 'equal': {
                if (Array.isArray(value) && value.length > 0) {
                    return In(value);
                }
                return Equal(value);
            }
            case 'in':
                if (Array.isArray(value) && value.length > 0) {
                    return In(value);
                } else {
                    return Equal(value);
                }
            case 'like':
                const likeStr = String(value);
                return Like(`%${likeStr}%`);
            case 'between':
                if (Array.isArray(value) && value.length === 2) {
                    return Between(value[0], value[1]);
                }
                return undefined;
            case 'not':
                if (Array.isArray(value)) {
                    return Not(In(value));
                }
                return Not(value);
            case 'moreThan':
                return MoreThan(value);
            case 'lessThan':
                return LessThan(value);
            case 'moreThanOrEqual':
                return MoreThanOrEqual(value);
            case 'lessThanOrEqual':
                return LessThanOrEqual(value);
            default:
                return undefined;
        }
    }

    /**
     * 根据参数构建 TypeORM 查询条件的字符串形式
     * 主要用于复杂关联查询，避免 queryBuilder.where({}) 在处理别名时可能出现的问题。
     * @param param 包含查询键值对的对象
     * @param alias 可选的表别名，用于构建关联查询字段
     * @returns 返回一个字符串形式的 WHERE 条件子句，例如 "a.name = ? AND a.age > ?" 或 "a.status IN (?)"
     */
    protected buildWhereString(param?: any, alias: string = '', type = "AND"): { where: string, parameters: object } | false {
        const allowedFieldTypes: Record<string, string[]> = this.filterWhere();
        if (_.isEmpty(allowedFieldTypes)) {
            return false;
        }

        if(this.softDelete && !Object.hasOwn(param,'is_delete')){
            param.is_delete = 0;
        }

        const fieldNameToOperatorMap = new Map<string, string>();
        Object.entries(allowedFieldTypes).forEach(([operatorType, fieldNames]) => {
            fieldNames.forEach(fieldName => {
                fieldNameToOperatorMap.set(fieldName, operatorType);
            });
        });

        if (fieldNameToOperatorMap.size === 0) {
            return false;
        }

        const conditions: string[] = [];
        const parameters: Record<string, any> = {};

        for (const [rawKey, rawValue] of Object.entries(param ?? {})) {
            if (rawValue === '' || rawValue === null || rawValue === undefined) {
                continue;
            }

            let processedKey = rawKey;
            let processedValue = rawValue;

            if (processedKey.endsWith('[]')) {
                processedKey = processedKey.slice(0, -2);
            }

            if (typeof processedValue === 'string' && processedValue.includes(',')) {
                processedValue = processedValue.split(',').map(v => v.trim());
            }

            const operatorType = fieldNameToOperatorMap.get(processedKey);
            if (!operatorType) {
                continue;
            }

            let finalKeyName = processedKey;
            if (alias && !processedKey.includes('.')) {
                finalKeyName = `${alias}.${processedKey}`;
            }

            const { sqlFragment, params } = this.createSqlFragmentAndParams(operatorType, finalKeyName, processedKey, processedValue);

            if (sqlFragment) {
                conditions.push(sqlFragment);
                if (params) {
                    Object.assign(parameters, params);
                }
            }
        }

        if (conditions.length === 0) {
            return false;
        }

        const fullWhereClause = conditions.join(` ${type} `);
        return { where: fullWhereClause, parameters };
    }

    /**
     * 根据操作符类型、字段名和值生成 SQL 片段和参数
     * @param operatorType 操作符类型
     * @param fieldName 完整的字段名 (可能包含别名)
     * @param value 原始值
     * @returns 包含 sqlFragment (SQL 片段字符串) 和 params (参数数组) 的对象
     */
    private createSqlFragmentAndParams(operatorType: string, fieldName: string, fieldKey: string, value: any): { sqlFragment: string; params?: Record<string, any> } {
        const paramName = fieldKey.replace(/\./g, '_');
        switch (operatorType) {
            case 'equal':
                if (Array.isArray(value) && value.length > 0) {
                    const placeholders = value.map((_, i) => `:${paramName}_${i}`).join(', ');
                    const params: Record<string, any> = {};
                    value.forEach((v, i) => { params[`${paramName}_${i}`] = v; });
                    return { sqlFragment: `${fieldName} IN (${placeholders})`, params };
                }
                return { sqlFragment: `${fieldName} = :${paramName}`, params: { [paramName]: value } };

            case 'in':
                if (Array.isArray(value) && value.length > 0) {
                    const placeholders = value.map((_, i) => `:${paramName}_${i}`).join(', ');
                    const params: Record<string, any> = {};
                    value.forEach((v, i) => { params[`${paramName}_${i}`] = v; });
                    return { sqlFragment: `${fieldName} IN (${placeholders})`, params };
                } else {
                    return { sqlFragment: `${fieldName} = :${paramName}`, params: { [paramName]: value } };
                }
            case 'like':
                const likeStr = String(value);
                return { sqlFragment: `${fieldName} LIKE :${paramName}`, params: { [paramName]: `%${likeStr}%` } };

            case 'between':
                if (Array.isArray(value) && value.length === 2) {
                    return { sqlFragment: `${fieldName} BETWEEN :${paramName}_0 AND :${paramName}_1`, params: { [`${paramName}_0`]: value[0], [`${paramName}_1`]: value[1] } };
                }
                console.warn(`Invalid value for 'between' condition: ${value}. Expected an array with two elements.`);
                return { sqlFragment: '' };

            case 'not':
                if (Array.isArray(value)) {
                    const placeholders = value.map((_, i) => `:${paramName}_${i}`).join(', ');
                    const params: Record<string, any> = {};
                    value.forEach((v, i) => { params[`${paramName}_${i}`] = v; });
                    return { sqlFragment: `${fieldName} NOT IN (${placeholders})`, params };
                }
                return { sqlFragment: `${fieldName} != :${paramName}`, params: { [paramName]: value } };

            case 'moreThan':
                return { sqlFragment: `${fieldName} > :${paramName}`, params: { [paramName]: value } };

            case 'lessThan':
                return { sqlFragment: `${fieldName} < :${paramName}`, params: { [paramName]: value } };

            case 'moreThanOrEqual':
                return { sqlFragment: `${fieldName} >= :${paramName}`, params: { [paramName]: value } };

            case 'lessThanOrEqual':
                return { sqlFragment: `${fieldName} <= :${paramName}`, params: { [paramName]: value } };

            default:
                console.warn(`Unknown operator type: ${operatorType}`);
                return { sqlFragment: '' };
        }
    }

    protected buildOrder(param?: any, alia: string = ''): { [P: string]: 'ASC' | 'DESC'; } {
        param = this.unflattenObject(param)
        /*
        orderBy:{
            id:'ASC',
            name:'DESC',
            age:'DESC'
        }*/
        if (!param.orderBy) {
            const key = _.isEmpty(alia) ? 'id' : `${alia}.id`;
            return { [key]: 'DESC' }
        }

        const orderBy = {};
        Object.entries(param.orderBy).forEach(([key, value]) => {
            if (!_.isEmpty(alia) && !key.includes('.')) {
                key = alia + '.' + key;
            }
            // @ts-ignore
            orderBy[key] = String(value).toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
        });
        return orderBy;
    }

    public unflattenObject(obj: Record<string, any>): Record<string, any> {
        const result: Record<string, any> = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const normalizedKey = key.replace(/\[([^\]]+)\]/g, '.$1');
                const keys = normalizedKey.split('.');
                let current = result;

                keys.forEach((k, index) => {
                    // 如果是最后一层，直接赋值
                    if (index === keys.length - 1) {
                        current[k] = obj[key];
                    } else {
                        // 如果中间层不存在，则创建空对象
                        if (!current[k]) {
                            current[k] = {};
                        }
                        current = current[k];
                    }
                });
            }
        }
        return result;
    }

    protected getError() {
        return this.error;
    }

    protected setError(error: string) {
        this.error = error;
    }

}