import axios, {URL_QUERY_DB_LIST} from "../axios";
import {Dispatch, useEffect, useState} from "react";
import {DbDetailItem, QueryType} from "../ds";



export const useQueryType = (): [DbDetailItem[], Dispatch<QueryType>] => {
    const [data, setData] = useState<DbDetailItem[]>([])
    const [query_type, setQuery_type] = useState<QueryType>(QueryType.ErpMissing)


    useEffect(() => {
        axios.get(URL_QUERY_DB_LIST, {params: {query_type, limit:5}}).then(s => {
            console.log(s.data)
            setData(s.data.data)
        })

    }, [query_type])

    return [data, setQuery_type]

}
