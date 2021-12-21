export interface FileState {
    key: string
    filename: string
    fileImported?: boolean
    fileRead?: boolean
    fileValidated?: boolean
    fileUploaded?: boolean
}

export enum FileStep {
    fileImported,
    fileRead,
    fileValidated,
    fileUploaded
}

export enum FileStepStatus {
    Waiting,
    Success,
    Error
}

// DB

/**
 * 基本通用数据库条目，包含_id字段，以及可供antd使用的key可选字段
 */
export interface DbItem {
    _id: string
    key?: any
}


/**
 * erp数据
 */
export interface DbErpDetailItem extends DbItem {
    file_name_erp: string
    area_erp: string
    time_erp: string
    logistics_erp: string
    weight_erp: number
    fee_eval?: number
}

/**
 * trd数据
 */
export interface DbTrdDetailItem extends DbItem {
    file_name_trd: string
    area_trd: string
    time_trd: string
    logistics_trd: string
    weight_trd: number
    fee_trd: number
}

/**
 * erp和trd数据都存在时，可以进行比较
 */
type ErpOrTrdDetailItem = DbTrdDetailItem & DbErpDetailItem

export interface DbCmpDetailItem extends ErpOrTrdDetailItem {
    validate_area?: boolean
    validate_date?: boolean
    validate_weight_small?: boolean
    validate_weight_less?: boolean
    validate_weight_ceil?: boolean
    validate_weight?: boolean
    validate_pass?: boolean
}


/**
 * erp、trd、cmp的联合类型
 */
export type DbDetailItem = DbErpDetailItem | DbTrdDetailItem | DbCmpDetailItem


export enum QueryType {
    ErpMissing = "ErpMissing",
    TrdMissing = "TrdMissing",
    AreaMismatch = "AreaMismatch",
    // DateMismatch = "DateMismatch",
    // WeightMismatch = "WeightMismatch"
}