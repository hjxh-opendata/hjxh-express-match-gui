import {DbCmpDetailItem, DbDetailItem, DbErpDetailItem, DbTrdDetailItem} from "./ds";

export const getDFName = (filename: string) => filename.split(".").slice(0, -1).join("") + "_df.csv"

// reference: https://rmolinamir.github.io/typescript-cheatsheet/#:~:text=Use%20type%2Dguards%20to%20check%20for%20instances%20of%20specifc%20objects.
export const isCmpDetailItem = (detailItem: DbDetailItem): detailItem is DbCmpDetailItem => {
    return (detailItem as DbErpDetailItem).area_erp !== undefined &&
        (detailItem as DbTrdDetailItem).area_trd !== undefined
}

export const getValidatedData = (_data: DbDetailItem[], weightSmall: number): [DbDetailItem[], number] => {
    let nValidated = 0
    const data = _data.map(_record => {
        const record = {..._record}

        if (!record.key) record.key = record._id;
        if (isCmpDetailItem(record)) {
            record.validate_area = record.area_erp === record.area_trd
            // validate_pass 不考虑时间
            // record.validate_date = record.time_erp === record.time_trd
            record.validate_weight_ceil = Math.ceil(record.weight_trd) === Math.ceil(record.weight_erp)
            record.validate_weight_less = record.weight_erp <= record.weight_trd
            record.validate_weight_small = record.weight_trd < weightSmall
            record.validate_weight = record.validate_weight_ceil || record.validate_weight_small || record.validate_weight_less
            record.validate_pass = record.validate_area && record.validate_weight
            nValidated += 1
        }
        return record;
    })
    return [data, nValidated]
}


// reference: https://stackoverflow.com/a/38241481/9422455
export function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}