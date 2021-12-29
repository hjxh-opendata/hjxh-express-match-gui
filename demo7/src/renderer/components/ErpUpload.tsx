import {Button} from "antd";

export const ErpUpload = () => {

    const readErps = () => {
        console.log('try to let main read erps')
        console.log(window)

        // @ts-ignore
        window.electronAPI.readErps()
    }


    return (
        <div className={'p-4'}>
            <Button onClick={readErps}>选取文件</Button>
        </div>
    )
}

export default ErpUpload
