import { Column } from "./Column";
import { Relation } from "./Relation";
import { Index } from "./Index";
import { RelationId } from "./RelationId";

export type Entity = {
    sqlName: string;
    tscName: string;
    tableComment?: string;
    relationString?: string;

    database?: string;
    schema?: string;

    columns: Column[];
    relationIds: RelationId[];
    relations: Relation[];
    indices: Index[];
    // TODO: move to sub-object or use handlebars helpers(?)
    fileName: string;
    fileImports: {
        entityName: string;
        fileName: string;
    }[];
    activeRecord?: true;
    generateConstructor?: true;
    where?:{
        equal?:string[];
        not?:string[];
        like?:string[];
        in?:string[];
        between?:string[];
        isNull?:string[];
        moreThan?:string[];
        lessThan?:string[];
        moreThanOrEqual?:string[];
        lessThanOrEqual?:string[];
        
    }
    selectFields?:string[];
};