import {Col} from "antd";

export enum Msg {
    db_query_req="db_query_req",
    db_query_res="db_query_res",
}

export enum DbName {
    admin="admin",
    hjxh_express_match="hjxh_express_match",
}

export enum CollName {
    items="items",
    stat="stat"
}

export interface Query{
    query: Record<string, any>
    limit?: number
    skip?: number
}

export interface QueryReq {
    query: Query
    collName: CollName
}