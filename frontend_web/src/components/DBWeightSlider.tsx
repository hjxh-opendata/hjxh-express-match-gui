import {useRef, useState} from "react";
import {InputNumber, Slider} from "antd";
import {isCmpDetailItem} from "../utils";
import {DbDetailItem} from "../ds";

export const DBWeightSlider = ({data}: { data: DbDetailItem[] }) => {

    /**
     * 用户控制，可以拖动滑动条，以改变通过验证的阈值
     */
    const WEIGHT_SMALL_MIN = 0, WEIGHT_SMALL_MAX = 5, WEIGHT_SMALL_STEP = 0.5;
    const [weightSmall, setWeightSmall] = useState(1)

    /**
     * 数据总体情况
     */
    const refNValidated = useRef(0)
    const refNTotal = useRef(0)
    const refPassRate = useRef(0)

    refNTotal.current = data.length
    refNValidated.current = 0
    console.log("refreshing data...")


    refPassRate.current = refNValidated.current / (refNTotal.current == 0 ? 1 : refNTotal.current);

    return <div className={"flex flex-wrap justify-start items-baseline h-full"}>

        <p>trd低于该重量则不考虑其错误：</p>

        <InputNumber
            min={WEIGHT_SMALL_MIN}
            max={WEIGHT_SMALL_MAX}
            value={weightSmall}
            onChange={setWeightSmall}
        />

        <Slider min={WEIGHT_SMALL_MIN} max={WEIGHT_SMALL_MAX} step={WEIGHT_SMALL_STEP}
                value={weightSmall} onChange={setWeightSmall} className={"mx-4 w-40 invisible md:visible"}/>

        <p className={"ml-auto font-semibold"}>
            通过验证：{refNValidated.current} / {refNTotal.current}，比率：
            <span className={"font-bold"} style={{color: refPassRate.current < 0.9 ? "darkred" : "green"}}>
                    {(refPassRate.current * 100).toFixed(2) + "%"}
                    </span>
        </p>

    </div>

}