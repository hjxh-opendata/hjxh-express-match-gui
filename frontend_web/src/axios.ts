import axios from 'axios'

// reference: [Adding Custom Environment Variables | Create React App](https://create-react-app.dev/docs/adding-custom-environment-variables/)

const HOST = "101.43.125.199"
const host = window.location.host // "localhost:3000"
const isOnline =  host.indexOf('localhost') === -1
console.log({host, isOnline})
const instance = axios.create({
    baseURL:  isOnline ? `http://${HOST}/api/v1` : "http://localhost:8000"
})


export default instance

export const URL_QUERY_DB_LIST = "/db/query/list"

// upload
export const URL_CheckFileExists = "/file/s1_check_file_exists"
export const URL_CheckFileInfo = "/file/s2_check_file_info"
export const URL_ReadFile2DF = "/file/s3_read_file2df"
export const URL_ValidateDF = "/file/s4_parse_df"
export const URL_CONFIRM_FILE = "/file/confirm"

// download
export const URL_DOWNLOAD_DF = "/file/download_df"
export const URL_DOWNLOAD_SOURCE = "/file/download_source"

// db
export const URL_DB_PUSH_FILE = "/db/push/file"
export const URL_DB_STAT_DATE = "/db/stat/date"
export const URL_DB_STAT_AREA = "/db/stat/area"
export const URL_DB_STAT_LOGISTICS = "/db/stat/logistics"

