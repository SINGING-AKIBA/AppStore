import * as Handlebars from "handlebars";
import * as Prettier from "prettier";
import * as changeCase from "change-case";
import * as fs from "fs";
import * as path from "path";
import { EOL } from "os";
import IConnectionOptions from "./IConnectionOptions";
import IGenerationOptions, { eolConverter } from "./IGenerationOptions";
import { Entity } from "./models/Entity";
import { Relation } from "./models/Relation";
import { Column } from "./models/Column";
import inquirer = require("inquirer");
import AbstractDriver from "./drivers/AbstractDriver";
import { Form } from "./vue3/form";
import { Detail } from "./vue3/Detail";
import { parseName } from "./Utils";
import { JoinColumnOptions, RelationOptions } from "typeorm";
import { JoinTableMultipleColumnsOptions } from "typeorm/decorator/options/JoinTableMultipleColumnsOptions";
import { fileName } from "./NamingStrategy";

const prettierOptions: Prettier.Options = {
    parser: "typescript",
    endOfLine: "auto",
};

// 模板编译缓存，避免重复读取和编译相同模板
const templateCache = new Map<string, Handlebars.TemplateDelegate>();
export interface MenuItem {
    'type': number;
    'pid': number;
    'title': string;
    'icon': string;
    'weigh': number;
    'status': number;
    'target': number;
    'path': string;
    'show': number;
    'create_time': number;
    'update_time': number;
    [key: string]: any;
}

export default async function modelGenerationPhase(
    connectionOptions: IConnectionOptions,
    generationOptions: IGenerationOptions,
    databaseModel: Entity[],
    driver: AbstractDriver,
): Promise<void> {
    createHandlebarsHelpers(generationOptions);

    const resultPath = generationOptions.resultsPath;
    if (!fs.existsSync(resultPath)) {
        fs.mkdirSync(resultPath, { recursive: true });
    }
    const common_name = getCommonName(generationOptions);
    let entitiesPath = path.resolve(resultPath, common_name, 'model');
    if (!generationOptions.noConfigs) {
        const tsconfigPath = path.resolve(resultPath, "tsconfig.json");
        const typeormConfigPath = path.resolve(resultPath, "ormconfig.json");

        createTsConfigFile(tsconfigPath);
        createTypeOrmConfig(typeormConfigPath, connectionOptions);
        // 实体文件夹
        entitiesPath = path.resolve(resultPath, "./entities");
        if (!fs.existsSync(entitiesPath)) {
            fs.mkdirSync(entitiesPath);
        }
    }
    if (generationOptions.indexFile) {
        createIndexFile(databaseModel, generationOptions, entitiesPath);
    }
    await generateModels(databaseModel, generationOptions, entitiesPath);
    await generateControllers(databaseModel, generationOptions, resultPath);
    await generateServices(databaseModel, generationOptions, resultPath);
    await generateValidate(databaseModel, generationOptions, resultPath);
    await generateMenus(databaseModel, generationOptions, driver);
    await generateViews(databaseModel, generationOptions);
    driver.DisconnectFromServer();
}

async function askForOverwrite(filePath: string): Promise<boolean> {
    const answer = await inquirer.prompt([
        {
            type: "confirm",
            name: "overwrite",
            message: `File ${filePath} already exists. Do you want to overwrite it?`,
            default: false,
        },
    ]);
    return answer.overwrite;
}

async function generateModels(
    databaseModel: Entity[],
    generationOptions: IGenerationOptions,
    entitiesPath: string
) {
    const entityTemplatePath = path.resolve(
        __dirname,
        "templates",
        "entity.mst"
    );
    const entityTemplate = fs.readFileSync(entityTemplatePath, "utf-8");
    const entityCompliedTemplate = Handlebars.compile(entityTemplate, {
        noEscape: true,
    });
    await Promise.all(databaseModel.map(async (element) => {
        const resultFilePath = path.resolve(
            entitiesPath,
            `${element.fileName}.ts`
        );
        if (generationOptions.delete) {
            await deleteFiles(resultFilePath, generationOptions);
        } else {
            // 过滤到Base中的字段
            if (generationOptions.commonFields.length > 0) {
                element.columns = element.columns.filter(col => !generationOptions.commonFields.includes(col.tscName))
            }
            await parseRelation(element, generationOptions)
            const content = removeUnusedImports(entityCompliedTemplate(element));
            await writeFile(resultFilePath, content, generationOptions);
        }
    }));
}

async function parseRelation(entity: Entity, generationOptions: IGenerationOptions) {
    if (entity.relationString) {

        const relationTypes = entity.relationString.split(',');
        const entityTableName = toFileName(entity.tscName, 'snake');

        for (const item of relationTypes) {
            const [relType, tables] = item.split('=');
            if (!tables) continue;

            const relTypeLower = relType.toLocaleLowerCase();
            tables.split('|').forEach(t => {
                const [tableName, ...params] = t.split('#');
                const paramArray = params.join('#').split(',').filter(p => p !== '');

                const inputName = toFileName(tableName, generationOptions.convertCaseFile);
                if (inputName != toFileName(entity.tscName, generationOptions.convertCaseFile)) {
                    entity.fileImports.push({
                        entityName: inputName,
                        fileName: inputName
                    });
                }

                let relationType: "OneToOne" | "OneToMany" | "ManyToOne" | "ManyToMany" = "OneToOne";
                let joinColumnOptions: Required<JoinColumnOptions>[] = [];
                let joinTableOptions: JoinTableMultipleColumnsOptions = {};
                let relationOptions: RelationOptions = {};

                switch (relTypeLower) {
                    case 'hasone':
                    case 'onetoone': {
                        relationType = 'OneToOne';
                        const foreignKey = paramArray[0] || `${tableName}_id`;
                        const localKey = paramArray[1] || 'id';
                        if (entity.columns.some(col => parseName(col.tscName) == parseName(foreignKey))) {
                            joinColumnOptions.push({
                                name: foreignKey,
                                referencedColumnName: localKey,
                                foreignKeyConstraintName: `FK_${entity.tscName}_${tableName}`,
                            });
                        } else {
                            relationOptions = {
                                cascade: true,
                                lazy: false,
                                eager: false,
                            };
                        }
                        break;
                    }
                    case 'hasmany':
                    case 'onetomany': {
                        relationType = 'OneToMany';
                        const foreignKey = paramArray[0] || `${tableName}_id`;
                        const localKey = paramArray[1] || 'id';
                        // OneToMany 通常概念比较小 正常外键应该在多的表中
                        if (entity.columns.some(col => parseName(col.tscName) == parseName(foreignKey))) {
                            joinColumnOptions.push({
                                name: foreignKey,
                                referencedColumnName: localKey,
                                foreignKeyConstraintName: `FK_${entity.tscName}_${tableName}`,
                            });
                        } else {
                            relationOptions = {
                                cascade: true,
                                lazy: false,
                                eager: false,
                            };
                        }
                        break;
                    }
                    case 'belongsto':
                    case 'manytoone': {
                        relationType = 'ManyToOne';
                        const foreignKey = paramArray[0] || `${tableName}_id`;
                        const localKey = paramArray[1] || 'id';
                        joinColumnOptions.push({
                            name: foreignKey,
                            referencedColumnName: localKey,
                            foreignKeyConstraintName: `FK_${entity.tscName}_${tableName}`,
                        });
                        break;
                    }
                    case 'belongstomany':
                    case 'manytomany': {
                        relationType = 'ManyToMany';
                        let middleTable = paramArray[0] || `${entityTableName}_${toFileName(tableName, 'snake')}`;
                        if (!middleTable.startsWith(generationOptions.crud.prefix)) {
                            middleTable = toFileName(generationOptions.crud.prefix + middleTable, 'snake');
                        }
                        const foreignKey = paramArray[1] || `${entityTableName}_id`;
                        const relatedForeignKey = paramArray[2] || `${toFileName(tableName, 'snake')}_id`;
                        const localKey = paramArray[3] || 'id';
                        const relatedLocalKey = paramArray[4] || 'id';

                        //中间表的规则是 主表名_关联表名
                        if (!middleTable.endsWith(entity.tscName.toLocaleLowerCase())) {
                            joinTableOptions = {
                                name: middleTable,
                                joinColumns: [{
                                    name: foreignKey,
                                    referencedColumnName: localKey,
                                }],
                                inverseJoinColumns: [{
                                    name: relatedForeignKey,
                                    referencedColumnName: relatedLocalKey,
                                }],
                            };
                            relationOptions = {
                                cascade: ["insert", "update"],
                                lazy: false,
                                eager: false,
                            };
                        }

                        break;
                    }
                }

                entity.relations.push({
                    relationType,
                    relatedTable: tableName,
                    relatedField: entityTableName,
                    fieldName: tableName,
                    ...(joinColumnOptions.length > 0 ? { joinColumnOptions } : {}),
                    ...(Object.keys(joinTableOptions).length > 0 ? { joinTableOptions } : {}),
                    ...(Object.keys(relationOptions).length > 0 ? { relationOptions } : {})
                });
            });
        }
    }

    //处理图片和视频关联
    const config = generationOptions.crud;
    const suffix = [...config.image.suffix, ...config.video.suffix];
    entity.columns.forEach(col => {
        if (suffix.some(s => col.tscName.endsWith(s)) && col.tscType == 'number') {
            entity.relations.push({
                relationType: 'OneToOne',
                relatedTable: 'Uploads',
                relatedField: 'id',
                fieldName: parseName(col.tscName, 1, false),
                joinColumnOptions: [{
                    name: col.tscName,
                    referencedColumnName: "id",
                    foreignKeyConstraintName: "FK_" + col.tscName,
                }]
            })
            entity.fileImports.push({
                entityName: "Uploads",
                fileName: "Uploads"
            });
        }
    })
}

async function writeFile(filePath: string, content: string, generationOptions: IGenerationOptions) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
    // 检查文件是否已存在，如果存在则提示用户是否覆盖
    if (fs.existsSync(filePath)) {
        if (!generationOptions.overwriteExistingFiles) {
            const shouldOverwrite = await askForOverwrite(filePath);
            if (!shouldOverwrite) {
                console.log(`Skipping file ${filePath}`);
                return;
            }
        }
    }

    const withImportStatements = EOL !== eolConverter[generationOptions.convertEol] ? content.replace(/(\r\n|\n|\r)/gm, eolConverter[generationOptions.convertEol]) : content;
    let formatted = "";
    try {
        formatted = Prettier.format(withImportStatements, prettierOptions);
    } catch (error) {
        formatted = withImportStatements;
    }
    fs.writeFileSync(filePath, formatted, {
        encoding: "utf-8",
        flag: "w",
    });
    console.log(`Generated file: ${filePath}  ✔`)
}


async function deleteFiles(filePaths: string, generationOptions: IGenerationOptions) {
    if (fs.existsSync(filePaths)) {
        let answer = true;
        if (!generationOptions.overwriteExistingFiles) {
            const confirm = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "delete",
                    message: `File ${filePaths} already exists. Do you want to delete it?`,
                    default: false,
                },
            ]);
            if (!confirm.delete) {
                return;
            } else {
                answer = true;
            }
        }
        if (answer) {
            try {
                fs.unlinkSync(filePaths);
                console.log(`Deleted file: ${filePaths}  ✔`)
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log(`Skipping file ${filePaths}`);
        }
    }
}

async function generateControllers(
    databaseModel: Entity[],
    generationOptions: IGenerationOptions,
    appPath: string
) {
    const common_name = getCommonName(generationOptions);
    let modules: string[] = getCommonModule(generationOptions, true, false);
    const complied = compliedTemplate('controller', generationOptions);

    await Promise.all(databaseModel.map(async (element) => {
        await Promise.all(modules.map(async (module) => {
            const filePath = path.resolve(appPath, module, "controller", `${element.fileName}.ts`);
            if (generationOptions.delete) {
                await deleteFiles(filePath, generationOptions);
            } else {
                const content = complied({ ...element, module, common_name });
                await writeFile(filePath, content, generationOptions);
            }
        }));
    }));
}

async function generateServices(
    databaseModel: Entity[],
    generationOptions: IGenerationOptions,
    appPath: string
) {
    const common_name = getCommonName(generationOptions);
    let modules: string[] = getCommonModule(generationOptions, true, false);
    const complied = compliedTemplate('service', generationOptions);
    await Promise.all(databaseModel.map(async (element) => {
        await Promise.all(modules.map(async (module) => {
            const filePath = path.resolve(appPath, module, "service", `${element.fileName}.ts`);
            if (generationOptions.delete) {
                await deleteFiles(filePath, generationOptions);
            } else {
                const content = complied({ ...element, module, common_name });
                await writeFile(filePath, content, generationOptions);
            }
        }));
    }));
}

async function generateViews(
    databaseModel: Entity[],
    generationOptions: IGenerationOptions,
) {
    const config = generationOptions.crud;
    const dir = path.resolve(config.view_admin_path);
    // 缓存组件类型映射，避免重复计算
    const componentTypeCache = new Map<string, string>();

    const getComponentType = (fieldName: string, dbFieldType: string): string => {
        const cacheKey = `${fieldName}-${dbFieldType}`;
        if (componentTypeCache.has(cacheKey)) {
            return componentTypeCache.get(cacheKey)!;
        }

        // 优先检查父字段
        if (config.parentFields.includes(fieldName)) {
            componentTypeCache.set(cacheKey, 'select');
            return 'select';
        }

        // 按配置优先级检查
        for (const key in config) {
            const { fieldType, suffix } = config[key];

            // 跳过没有配置的项
            if (!fieldType && !suffix) continue;

            // 检查后缀匹配
            if (suffix && suffix.some(item => fieldName.endsWith(item))) {
                componentTypeCache.set(cacheKey, key);
                return key;
            }

            // 检查字段类型匹配
            if (fieldType && fieldType.includes(dbFieldType)) {
                componentTypeCache.set(cacheKey, key);
                return key;
            }
        }

        // 默认返回 input
        componentTypeCache.set(cacheKey, 'input');
        return 'input';
    };

    const createFormItem = (item: Column, componentType: string, from: Form): string => {
        switch (componentType) {
            case 'input':
                return from.input(item, '', 'text', '0', (item.options.length || '').toString()) + EOL;
            case 'inputNumber':
                return from.inputNumber(item, item.options.scale, '0', (item.options.precision || '').toString()) + EOL;
            case 'image':
            case 'editor':
            case 'textarea':
            case 'video':
            case 'checkbox':
            case 'select':
            case 'radio':
            case 'switch':
                return from[componentType](item, '') + EOL;
            case 'date':
                return from.date(item) + EOL;
            default:
                return from.input(item) + EOL;
        }
    };

    // 预计算过滤条件，避免重复计算
    const filterSuffix = [...config.editor.suffix, config.video.suffix, config.textarea.suffix];
    const filterType = [...config.editor.fieldType, config.video.fieldType, config.textarea.fieldType];

    // 生成 select 相关函数的辅助方法
    const generateSelectFunction = (selectField: string, selectFun: string, indent2: string, indent4: string): string => {
        let functionStr = '';

        // select 函数
        functionStr += `function ${selectField}Select(){${EOL}`;
        functionStr += `${indent2}${selectField}SelectApi(${selectField}Query).then(res=>{${EOL}`;
        functionStr += `${indent4}${selectField}Options.value = res.data.data;${EOL}`;
        functionStr += `${indent2}})${EOL}`;
        functionStr += `};${EOL}`;

        // search 函数
        functionStr += `const ${selectField}Debounce = debounce(${selectField}Select,800);${EOL}`;
        functionStr += `function ${selectFun}Search(value){${EOL}`;
        functionStr += `${indent2}${selectField}Query['search'] = value;${EOL}`;
        functionStr += `${indent2}${selectField}Debounce();${EOL}`;
        functionStr += `};${EOL}`;

        return functionStr;
    };

    const createParams = (element: Entity, leval: number = 0) => {
        const fields = element.columns.map(i => i.tscName);
        const result = {
            ...element,
            columns: '',
            formItem: '',
            slot: '',
            fields: '',
            detailItem: '',
            import: '',
            importRun: '',
            importCreate: '',
            optionVar: '',
            detailColumn: '',
            detailVar: '',
            tabPane: '',
            mapOption: '',
            searchFormItem: '',
            tabPaneArray: [] as any[],
        };

        const from = new Form();
        const detail = new Detail();
        const searchFormFields: string[] = [];
        const tabPane = [{ title: '基本信息', content: '' }];
        const tabPaneType = ['editor'];
        const descriptions = [{ title: '基本信息', column: 4, content: '' }];
        const descriptionsType = ['textarea', 'editor', 'image', 'video',];
        // 收集搜索字段
        for (const k in element.where) {
            const val = element.where[k] as string[];
            searchFormFields.push(...val);
        }

        const indent2 = '  ';
        const indent4 = '    ';
        const indent8 = '        ';
        const indent10 = '          ';
        const indent12 = '            ';
        for (const i of element.columns) {
            const item = deepClone(i);
            const comment = item.options.comment || item.tscName;
            let title = comment;
            let paramStr;
            let paramsObj;
            let customRender = '';
            let rules = '';
            // 确保 dbFieldType 是字符串类型
            const dbFieldType = typeof item.type === 'string' ? item.type : item.type.name || 'string';
            let componentType = getComponentType(item.tscName, dbFieldType);

            // 处理带参数的注释
            if (title.includes(':')) {
                [title, paramStr] = title.split(':', 2);
                if (paramStr) {
                    paramsObj = paramStr.split(',').reduce((acc, pair) => {
                        const [key, value] = pair.split('=');
                        if (key && value) {
                            acc[key.trim()] = value.trim();
                        }
                        return acc;
                    }, {});

                    customRender = `${EOL}${indent4}customRender: ({text}) => (${JSON.stringify(paramsObj)}[text])`;
                    if (componentType === 'input') {
                        componentType = 'select';
                    }
                }
                item.options.comment = title;

            }
            item['commentParams'] = paramsObj;
            item['isParent'] = config.parentFields.includes(item.tscName);

            // 判断是否在表格中显示
            const showInTable = !filterSuffix.some(suffix => item.tscName.endsWith(suffix)) &&
                !filterType.includes(dbFieldType);

            // 处理表格列
            if (showInTable) {
                let column = `${EOL}${indent2}{${EOL}${indent4}title: '${title}',${EOL}${indent4}dataIndex: '${item.tscName}',${EOL}${indent4}disabled: false,${customRender}${EOL}${indent2}},`;
                result.columns += column;

                // 处理图片字段的特殊渲染
                if (config.image.suffix.some(suffix => item.tscName.endsWith(suffix)) ||
                    config.image.fieldType.includes(dbFieldType)) {
                    const imageTemplate = item.tscType === 'string'
                        ? `<template v-if="item.column.dataIndex ==='${item.tscName}'" ><div class="table-image"><a-image v-for="i in (item.text ? item.text.split(','):[])" :width="45" :height="45" :src="i" :key="i" /></div></template>`
                        : `<template v-if="item.column.dataIndex ==='${item.tscName}'" ><div class="table-image"><a-image  :width="45" :height="45" :src="item.record?.${parseName(item.tscName, 1, false)}?.url" /></div></template>`;
                    result.slot += imageTemplate;
                }
            }

            // 处理表单参数
            let fromItem = createFormItem(item, componentType, from);
            let options = '';
            if (!config.systemField.includes(item.tscName)) {
                // 处理 select 相关逻辑
                if ((componentType === 'select' && !paramsObj) || config.parentFields.includes(item.tscName)) {
                    const selectFun = parseName(item.tscName.replace(/_ids?$/, ''), 1, false);
                    let selectField = selectFun;

                    if (item.isParent === true) {
                        selectField = element.tscName;
                    }

                    // 生成 select 相关函数
                    result.importCreate += generateSelectFunction(selectField, selectFun, indent2, indent4);

                    // 生成选项变量
                    result.optionVar += `const ${selectField}Options = ref([]);${EOL}`;
                    result.optionVar += `const ${selectField}Query = reactive({});${EOL}`;

                    // 导入 API
                    const fileName = parseName(selectField);
                    result.import += `import { select as ${selectField}SelectApi } from '@/api/${fileName}';${EOL}`;

                    options = `<a-select-option v-for="item in ${selectField}Options" :key="item.value">{{item.label}}</a-select-option>`;
                    result.importRun += `${selectField}Select();`;
                }
                // 添加必填验证规则
                if (!item.options.nullable) {
                    rules = `:rules="[{required:true,message:'${title}不能为空'}]"`;
                }

                let addFromItem = fromItem.replace('{&option&}', options).replace('{%rules%}', rules);
                if (tabPaneType.includes(componentType)) {
                    tabPane.push({ title, content: addFromItem });
                } else {
                    tabPane[0].content += addFromItem;
                }
            }

            // 处理搜索表单
            if (searchFormFields.includes(item.tscName) && showInTable && componentType !== 'image') {
                result.searchFormItem += fromItem.replace('{%rules%}', '').replace('{&option&}',options);
            }

            // 处理详情页面
            if (descriptionsType.includes(componentType)) {
                const content = 'editor' == componentType ? detail.html(item) : detail[componentType](item);
                descriptions.push({ title, content, column: 24 })
            } else {
                descriptions[0].content += detail[componentType](item);
            }
        }

        descriptions.forEach((d, i) => {
            if (i == 0) {
                result.detailItem += detail.descriptions(d.content, d.title, d.column);
            } else {
                result.detailItem += d.content;
            }
        })
        //处理关联模型
        if (element.relations.length > 0 && leval === 0) {
            for (const r of element.relations) {
                if (r.relatedTable == 'Uploads') {
                    continue;
                }
                const joinEntity = databaseModel.find(e => e.tscName == parseName(r.relatedTable));
                if (!joinEntity) {
                    continue;
                }

                joinEntity.columns = joinEntity.columns.filter(c => parseName(c.tscName) != parseName(element.tscName + '_id'));
                const joinParams = createParams(joinEntity, 1);
                if (joinParams.tabPaneArray) {
                    joinParams.tabPaneArray[0].title = joinEntity.tableComment;
                }
                result.detailItem += detail.table(r.relatedTable, joinParams.slot, joinEntity.tableComment);
                result.detailColumn += `const ${r.relatedTable}Columns = [${joinParams.columns}];`;
                let joinField = '{';
                joinEntity.columns.forEach(c => {
                    joinField += `${c.tscName}:'',`;
                });
                joinField += '}';
                let fun = parseName(r.relatedTable, 1, false);
                if (parseName(element.tscName) != parseName(r.relatedTable)) {
                    fields.push(r.relatedTable);
                }

                switch (r.relationType) {
                    case 'OneToOne':
                        //case 'ManyToOne':
                        tabPane.push(...joinParams.tabPaneArray);
                        tabPane[tabPane.length - 1].content += `<a-form-item class="hidden"><a-input v-model:value="formData.${r.relatedTable}.id" /></a-form-item>'`
                        result.detailVar += `${r.relatedTable}:[${joinField}],`;
                        break;
                    case 'OneToMany':
                        result.importCreate += `function ${fun}Remove(i){formData.${r.relatedTable}.length >=2 && formData.${r.relatedTable}.splice(-1,1)};${EOL}`;
                        result.importCreate += `function ${fun}Add(){formData.${r.relatedTable}.push(${joinField})};${EOL}`;
                        let formTemplate = `${indent8}<div class="join-form-wrapper">${EOL}`;
                        formTemplate += `${indent10}<div class="join-form-item" v-for="(item,index) in formData.${r.relatedTable}" :key="index">${EOL}`;
                        const nameRegex = /name="([^"]+)"/g;
                        const valueRegex = /"formData.([^"]+)"/g;
                        const detailRegex = /detailData\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
                        for (const d of joinParams.tabPaneArray) {
                            let dContent = d.content.replace(valueRegex, (match, name) => {
                                return `"formData.${r.relatedTable}[index].${name}"`;
                            });
                            dContent = dContent.replace(detailRegex, (match, name) => {
                                return `detailData.${r.relatedTable}[index].${name}`;
                            });
                            formTemplate += dContent.replace(nameRegex, (match, name) => {
                                return `:name="['${r.relatedTable}', index, '${name}']"`;
                            });
                        }
                        formTemplate += `${indent10}<a-form-item class="hidden" :name="['${r.relatedTable}',index,'id']"><a-input v-model:value="formData.${r.relatedTable}[index].id" /></a-form-item>${EOL}`;
                        formTemplate += `${indent10}</div>${EOL}`;
                        formTemplate += `${indent10}<div class="btn-group">${EOL}`;
                        formTemplate += `${indent12}<a-button class="remove" type="danger" @click="${fun}Remove">删除</a-button>${EOL}`;
                        formTemplate += `${indent12}<a-button class="add" type="primary" @click="${fun}Add">添加</a-button>${EOL}`;
                        formTemplate += `${indent10}</div>${EOL}`;
                        formTemplate += `${indent8}</div>${EOL}`;
                        formTemplate = formTemplate.replace('formData && ', `formData.${r.relatedTable} && `);
                        tabPane.push({ title: joinEntity.tableComment || joinEntity.tscName, content: formTemplate });
                        result.detailVar += `${r.relatedTable}:[${joinField}],`;
                        break;
                    case 'ManyToMany':
                        result.mapOption += `detail.${r.relatedTable}=detail.${r.relatedTable}.map(i=>i.id);`
                        let selectParams = {
                            commentParams: false,
                            options: { comment: joinEntity.tableComment },
                            tscName: r.relatedTable,
                        }
                        let seletTemplate = from.select(selectParams, '', 'multiple');
                        result.importCreate += generateSelectFunction(fun, fun, indent2, indent4);
                        // 生成选项变量
                        result.optionVar += `const ${fun}Options = ref([]);${EOL}`;
                        result.optionVar += `const ${fun}Query = reactive({});${EOL}`;

                        // 导入 API
                        const fileName = parseName(joinEntity.fileName);
                        result.import += `import { select as ${fun}SelectApi } from '@/api/${fileName}';${EOL}`;

                        let options = `<a-select-option v-for="item in ${fun}Options" :key="item.value">{{item.label}}</a-select-option>`;
                        result.importRun += `${fun}Select();`;
                        seletTemplate = seletTemplate.replace('{&option&}', options).replace('{%rules%}', '');
                        tabPane.push({ title: joinEntity.tableComment || joinEntity.tscName, content: seletTemplate });
                        break;
                }
            }
        }
        tabPane.forEach((tp, index) => {
            result.tabPane += from.createTabPane(tp.title, index + 1);
            result.formItem += from.createTabPaneContent(tp.content, index + 1);
        });
        result['tabPaneArray'] = tabPane;
        result.fields = `"${fields.join('","')}"`;
        return result;
    };

    // 主循环处理每个实体
    await Promise.all(databaseModel.map(async (element) => {
        const viewsPath = path.join(dir, 'views', element.fileName.toLowerCase());
        const files = {
            'index': path.join(viewsPath, 'Index.vue'),
            'detail': path.join(viewsPath, 'Detail.vue'),
            'add': path.join(viewsPath, 'Add.vue'),
            'update': path.join(viewsPath, 'Update.vue'),
            'api': path.join(dir, 'api', element.fileName + '.js')
        };
        const params = createParams(element);
        await Promise.all(Object.entries(files).map(async ([fileType, filePath]) => {
            if (generationOptions.delete) {
                await deleteFiles(filePath, generationOptions);
            } else {
                const complied = compliedTemplate(fileType, generationOptions);
                const content = complied(params).replace(/<\{(.*?)\}>/g, '{{$1}}');
                await writeFile(filePath, content, generationOptions);
            }
        }));

        if (generationOptions.delete && fs.existsSync(viewsPath)) {
            try {
                fs.rmdirSync(viewsPath);
                console.log(`Deleted directory: ${viewsPath}  ✔`);
            } catch (error) {
                console.error(error);
            }
        }
    }));
}

async function generateMenus(
    databaseModel: Entity[],
    generationOptions: IGenerationOptions,
    driver: AbstractDriver,
) {
    //操作
    const action = { 'Index': '列表', 'Add': '添加', 'Update': '编辑', 'Delete': '删除', 'Detail': '详情', 'Select': '选择', 'Export': '导出' };
    const time = () => {
        return Math.floor(new Date().getTime() / 1000);
    };

    const item: MenuItem = {
        'type': 20,
        'pid': generationOptions.pid || 0,
        'title': '',
        'icon': '',
        'weigh': 100,
        'status': 10,
        'target': 10,
        'path': '',
        'show': 10,
        'create_time': time(),
        'update_time': time(),
    };

    const createMenu = (element: Entity) => {
        const menus: MenuItem[] = [];
        for (const actionName in action) {
            const dir = element.tscName.toLocaleLowerCase().replace(/_/g, '').trim();
            let menu: MenuItem = {
                ...item,
                "title": actionName === 'Index' ? element.tableComment || element.tscName : action[actionName],
                "path": `/${dir}/${actionName}`,
            };
            menus.push(menu);
        }
        return menus;
    };
    await Promise.all(databaseModel.map(async (element) => {
        const menus = createMenu(element);
        if (generationOptions.delete) {
            await driver.deleteMenus(menus);
        } else {
            await driver.createMenus(menus);
        }
    }));
}

async function generateValidate(
    databaseModel: Entity[],
    generationOptions: IGenerationOptions,
    appPath: string
) {
    let modules: string[] = getCommonModule(generationOptions);
    const common_name = getCommonName(generationOptions);
    const compliedCommon = compliedTemplate('validate_common', generationOptions);
    const complied = compliedTemplate('validate', generationOptions);
    await Promise.all(databaseModel.map(async (element) => {
        await Promise.all(modules.map(async (module) => {
            const filePath = path.resolve(appPath, module, "validate", `${element.fileName}.ts`);
            if (generationOptions.delete) {
                await deleteFiles(filePath, generationOptions);
            } else {
                let content = "";
                if (module === common_name) {
                    content = compliedCommon({ ...element, module });
                } else {
                    content = complied({ ...element, module, common_name });
                }
                await writeFile(filePath, content, generationOptions);
            }
        }));
    }));
}

function compliedTemplate(templateName: string, generationOptions: IGenerationOptions) {
    const version = generationOptions.crud.tpl_dir || 'vue3';
    const cacheKey = `${version}/${templateName}`;
    const cached = templateCache.get(cacheKey);
    if (cached) {
        return cached;
    }
    const templatePath = path.resolve(__dirname, "templates", version, `${templateName}.mst`);
    const template = fs.readFileSync(templatePath, "utf-8");
    const complied = Handlebars.compile(template, {
        noEscape: true,
    });
    templateCache.set(cacheKey, complied);
    return complied;
}

function getCommonName(generationOptions: IGenerationOptions): string {
    if (generationOptions.crud && generationOptions.crud.comon_name) {
        return generationOptions.crud.comon_name as string;
    }
    return 'common';
}

function getCommonModule(generationOptions: IGenerationOptions, admihn: boolean = true, common: boolean = true) {
    let modules: string[] = [];
    const crud = generationOptions.crud || {};
    if (admihn) {
        if (crud.admin_name) {
            modules.push(crud.admin_name as string)
        } else {
            modules.push("admin")
        }
    }
    if (common) {
        if (crud.comon_name) {
            modules.push(crud.comon_name as string)
        } else {
            modules.push("common")
        }
    }
    if (crud.module) {
        modules = [...crud.module as string[], ...modules]
    }
    return modules;
}


async function createIndexFile(
    databaseModel: Entity[],
    generationOptions: IGenerationOptions,
    entitiesPath: string
) {
    const templatePath = path.resolve(__dirname, "templates", "index.mst");
    const template = fs.readFileSync(templatePath, "utf-8");
    const compliedTemplate = Handlebars.compile(template, {
        noEscape: true,
    });
    const rendered = compliedTemplate({ entities: databaseModel });
    const formatted = Prettier.format(rendered, prettierOptions);
    let fileName = "index";
    switch (generationOptions.convertCaseFile) {
        case "camel":
            fileName = changeCase.camelCase(fileName);
            break;
        case "param":
            fileName = changeCase.paramCase(fileName);
            break;
        case "pascal":
            fileName = changeCase.pascalCase(fileName);
            break;
        default:
    }
    const resultFilePath = path.resolve(entitiesPath, `${fileName}.ts`);

    // 检查索引文件是否已存在，如果存在则提示用户是否覆盖
    if (fs.existsSync(resultFilePath)) {
        if (!generationOptions.overwriteExistingFiles) {
            const shouldOverwrite = await askForOverwrite(resultFilePath);
            if (!shouldOverwrite) {
                console.log(`Skipping index file ${resultFilePath}`);
                return;
            }
        }
    }

    fs.writeFileSync(resultFilePath, formatted, {
        encoding: "utf-8",
        flag: "w",
    });
}

function removeUnusedImports(rendered: string) {
    const openBracketIndex = rendered.indexOf("{") + 1;
    const closeBracketIndex = rendered.indexOf("}");
    const imports = rendered
        .substring(openBracketIndex, closeBracketIndex)
        .split(",");
    const restOfEntityDefinition = rendered.substring(closeBracketIndex);
    const distinctImports = imports.filter(
        (v) =>
            restOfEntityDefinition.indexOf(`@${v}(`) !== -1 ||
            (v === "BaseEntity" && restOfEntityDefinition.indexOf(v) !== -1)
    );
    return `${rendered.substring(0, openBracketIndex)}${distinctImports.join(
        ","
    )}${restOfEntityDefinition}`;
}


function toFileName(str: string, convertCaseFile) {
    let retStr = "";
    switch (convertCaseFile) {
        case "camel":
            retStr = changeCase.camelCase(str);
            break;
        case "param":
            retStr = changeCase.paramCase(str);
            break;
        case "pascal":
            retStr = changeCase.pascalCase(str);
            break;
        case "snake":
            retStr = changeCase.snakeCase(str);
            break;
        case "none":
            retStr = str;
            break;
        default:
            throw new Error("Unknown case style");
    }
    return retStr;
}

function createHandlebarsHelpers(generationOptions: IGenerationOptions): void {
    Handlebars.registerHelper("json", (context) => {
        const json = JSON.stringify(context);
        const withoutQuotes = json.replace(/"([^(")"]+)":/g, "$1:");
        return withoutQuotes.slice(1, withoutQuotes.length - 1);
    });
    Handlebars.registerHelper("toEntityName", (str) => {
        let retStr = "";
        switch (generationOptions.convertCaseEntity) {
            case "camel":
                retStr = changeCase.camelCase(str);
                break;
            case "pascal":
                retStr = changeCase.pascalCase(str);
                break;
            case "none":
                retStr = str;
                break;
            default:
                throw new Error("Unknown case style");
        }
        return retStr;
    });
    Handlebars.registerHelper("toFileName", (str) => {
        return toFileName(str, generationOptions.convertCaseFile);
    });
    Handlebars.registerHelper("printPropertyVisibility", () =>
        generationOptions.propertyVisibility !== "none"
            ? `${generationOptions.propertyVisibility} `
            : ""
    );
    Handlebars.registerHelper("toPropertyName", (str) => {
        let retStr = "";
        switch (generationOptions.convertCaseProperty) {
            case "camel":
                retStr = changeCase.camelCase(str);
                break;
            case "pascal":
                retStr = changeCase.pascalCase(str);
                break;
            case "none":
                retStr = str;
                break;
            case "snake":
                retStr = changeCase.snakeCase(str);
                break;
            default:
                throw new Error("Unknown case style");
        }
        return retStr;
    });
    Handlebars.registerHelper(
        "toRelation",
        (entityType: string, relationType: Relation["relationType"]) => {
            let retVal = entityType;
            if (relationType === "ManyToMany" || relationType === "OneToMany") {
                retVal = `${retVal}[]`;
            }
            if (generationOptions.lazy) {
                retVal = `Promise<${retVal}>`;
            }
            return retVal;
        }
    );
    Handlebars.registerHelper("defaultExport", () =>
        generationOptions.exportType === "default" ? "default" : ""
    );
    Handlebars.registerHelper("localImport", (entityName: string) =>
        generationOptions.exportType === "default"
            ? entityName
            : `{${entityName}}`
    );
    Handlebars.registerHelper("strictMode", () =>
        generationOptions.strictMode !== "none"
            ? generationOptions.strictMode
            : ""
    );
    Handlebars.registerHelper("toLowerCase", (str: string) => {
        return str.toLocaleLowerCase();
    });

    Handlebars.registerHelper({
        and: (v1, v2) => v1 && v2,
        eq: (v1, v2) => v1 === v2,
        gt: (v1, v2) => v1 > v2,
        gte: (v1, v2) => v1 >= v2,
        lt: (v1, v2) => v1 < v2,
        lte: (v1, v2) => v1 <= v2,
        ne: (v1, v2) => v1 !== v2,
        or: (v1, v2) => v1 || v2,
    });

    Handlebars.registerHelper("getJoiRule", (column: Column) => {
        let { tscType, options } = column;
        let rule = "Joi.";

        const INTEGER_LIMITS: Record<string, [string, string, string, string]> = {
            tinyint: ['-128', '127', '0', '255'],
            smallint: ['-32768', '32767', '0', '65535'],
            mediumint: ['-8388608', '8388607', '0', '16777215'],
            int: ['-2147483648', '2147483647', '0', '4294967295'],
            bigint: ['-9223372036854775808', '9223372036854775807', '0', '18446744073709551615']
        };
        if (tscType == 'string' && column.type == 'bigint') {
            tscType = 'number'
        }

        switch (tscType) {
            case "string":
                rule += "string()";
                if (options.length) {
                    rule += `.max(${options.length})`;
                }
                const name = options.name.toLowerCase();
                const urls: string[] = [];
                const crud = generationOptions.crud;
                if (crud) {
                    crud.image?.suffix?.length && urls.push(...crud.image.suffix as string[]);
                    crud.video?.suffix?.length && urls.push(...crud.video.suffix as string[]);
                }
                if (name.includes("email")) {
                    rule += ".email()";
                } else if (urls.includes(name)) {
                    rule += ".uri()";
                } else if (name.includes("alphanum")) {
                    rule += ".alphanum()";
                }
                break;
            case "number":
                rule += "number()";
                const intType = column.type as keyof typeof INTEGER_LIMITS;
                if (intType in INTEGER_LIMITS) {
                    const limits = INTEGER_LIMITS[intType];
                    rule += options.unsigned ? `.min(0).max(${limits[3]})` : `.min(${limits[0]}).max(${limits[1]})`;
                } else if (column.type === "float") {
                    rule += ".float()";
                } else if (column.type === "decimal") {
                    rule += `.precision(${options.precision}).scale(${options.scale})`;
                }
                break;
            case "boolean":
                rule += "boolean()";
                break;
            case "Date":
                rule += "date()";
                break;
            case "Object":
                rule += "object()";
                break;
            default:
                rule += "any()";
        }

        if (options.comment?.includes(":")) {
            const enumPart = options.comment.split(":")[1];
            const enumValues = enumPart.split(",")
                .map(part => part.split("=")[0].trim())
                .filter(Boolean);

            if (enumValues.length > 0) {
                const formattedValues = enumValues.map(value =>
                    isNaN(Number(value)) ? `"${value.replace(/^["']|["']$/g, '')}"` : value
                );
                rule += `.valid(${formattedValues.join(", ")})`;
            }
        }

        rule += options?.nullable ? ".optional().allow(null,'')" : ".required()";

        if (options.comment) {
            const label = options.comment.split(":")[0];
            rule += `.label("${label}")`;
        }

        return rule;
    });
}

function deepClone<T>(obj: T): T {
    // structuredClone is available in Node 17+, falls back gracefully on older versions
    const cloneFn = (globalThis as any).structuredClone;
    return (typeof cloneFn === 'function' ? cloneFn(obj) : JSON.parse(JSON.stringify(obj))) as T;
}

function createTsConfigFile(tsconfigPath: string): void {
    if (fs.existsSync(tsconfigPath)) {
        console.warn(
            `\x1b[33m[${new Date().toLocaleTimeString()}] WARNING: Skipping generation of tsconfig.json file. File already exists. \x1b[0m`
        );
        return;
    }
    const templatePath = path.resolve(__dirname, "templates", "tsconfig.mst");
    const template = fs.readFileSync(templatePath, "utf-8");
    const compliedTemplate = Handlebars.compile(template, {
        noEscape: true,
    });
    const rendered = compliedTemplate({});
    const formatted = Prettier.format(rendered, { parser: "json" });
    fs.writeFileSync(tsconfigPath, formatted, {
        encoding: "utf-8",
        flag: "w",
    });
}
function createTypeOrmConfig(
    typeormConfigPath: string,
    connectionOptions: IConnectionOptions
): void {
    if (fs.existsSync(typeormConfigPath)) {
        console.warn(
            `\x1b[33m[${new Date().toLocaleTimeString()}] WARNING: Skipping generation of ormconfig.json file. File already exists. \x1b[0m`
        );
        return;
    }
    const templatePath = path.resolve(__dirname, "templates", "ormconfig.mst");
    const template = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = Handlebars.compile(template, {
        noEscape: true,
    });
    const rendered = compiledTemplate(connectionOptions);
    const formatted = Prettier.format(rendered, { parser: "json" });
    fs.writeFileSync(typeormConfigPath, formatted, {
        encoding: "utf-8",
        flag: "w",
    });
}
