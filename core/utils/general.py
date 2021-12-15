import json
import os
import re
from datetime import datetime, timedelta
from tempfile import SpooledTemporaryFile
from typing import Dict, List, Union

from ..config import (ERP_GUESS_KEYWORD, GUESS_ERP_ENCODING_ALLOWED,
                      TEMPLATE_DIR)


def guess_encoding(f: SpooledTemporaryFile, keyword: str = ERP_GUESS_KEYWORD) -> str:
    """[summary]
    读csv容易有编码错误，可加`unicode_escape`，参考：https://stackoverflow.com/a/50538501/9422455
    然而上条是不行的，考虑到用户总是用中文传输，所以可以直接使用gbk，经测试可行~
    然而上条还是不行，有些表用gbk可读，其他的表直接报错；有些表不加任何参数可读，但有些表就会乱码，基于此，先用gbk读，如果报错，则去除参数，这样即可顺利读取目前发现的两种表
    然而上条还是不行，由于是流，第一遍直接读完了就空了！
    经过测试，如果加了utf_8头，则开头是'\ufeff'，否则就可以用gbk读
    然而上面这个还是不稳健，毕竟头有时有，有时没有，所以不如直接读第一行，然后寻找目标关键字

    Args:
        f (SpooledTemporaryFile): [description]

    Raises:
        Exception: [description]

    Returns:
        str: [description]
    """
    f.seek(0)  # 防止文件指针不在原位
    for encoding in GUESS_ERP_ENCODING_ALLOWED:
        try:
            # print(f"tell: {f.tell()}")
            if keyword in str(f.readline(), encoding=encoding):
                # print("found and return")
                return encoding
        except UnicodeDecodeError:
            # print("not found and next")
            pass
        finally:    # 这个finally用的妙啊，这样就算在try里return了这里也会执行
            # print("seek 0")
            f.seek(0)
    else:
        raise Exception("本文件无法得知编码，请反馈给南川")


def get_last_month_string():
    """获得上个月的YYYY-MM格式字符串

    Returns:
        [type]: [description]
    """
    d = datetime.now().replace(day=1) - timedelta(days=1)
    return d.strftime("%Y-%m")


def load_template_file(file_name) -> Union[Dict, List, None]:
    """从json文件中加载模板字符串，并进行函数解析，需要注意的是，如果带有函数则需要提前导入，否则会导致函数缺失问题
    另外还有一个有趣的事，因为在解析到函数之后可能还要运行，也就是有`()`标识，因此在匹配的时候，就不适合将`()`作为定界符，否则就容易导致失配（除非用栈进行括号匹配，这不是正则擅长的事……）

    Args:
        file_name ([type]): [description]

    Returns:
        json: [description]
    """
    try:
        with open(os.path.join(TEMPLATE_DIR, file_name), "r") as f:
            return json.loads(re.sub(r'\${(.*?)}', lambda x: eval(x.group(1)), f.read()))
    except NameError as e:
        print(e.args)


if __name__ == "__main__":
    print(get_last_month_string())
