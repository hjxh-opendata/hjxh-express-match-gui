"""
refer: (20条消息) Python获取文件哈希md5、sha256、sha512等方法_你好，PurePeace！-CSDN博客_python sha512, https://blog.csdn.net/qq_26373925/article/details/115409308
"""
import os
import hashlib

# 使用python3.8及以上可以用此方法，写法更简洁。
from typing import io, Union


def _file_hash(file_path_or_bytes: Union[str, io.IO], hash_method) -> str:
    def handle_bytes(file: io.BinaryIO):
        h = hash_method()
        while b := file.read(8192):
            h.update(b)
        file.seek(0)
        return h

    if isinstance(file_path_or_bytes, str):
        if not os.path.isfile(file_path_or_bytes):
            print('文件不存在。')
            return ''
        else:
            file = open(file_path_or_bytes, "rb")
    else:
        file = file_path_or_bytes

    h = handle_bytes(file)
    return h.hexdigest()


# 其它python3版本使用此方法
'''
def file_hash(file_path: str, hash_method) -> str:
    if not os.path.isfile(file_path):
        print('文件不存在。')
        return ''
    h = hash_method()
    with open(file_path, 'rb') as f:
        while True:
            b = f.read(8192)
            if not b:
                break	
            h.update(b)
    return h.hexdigest()
'''


def str_hash(content: str, hash_method, encoding: str = 'UTF-8') -> str:
    return hash_method(content.encode(encoding)).hexdigest()


def file_md5(file_path: str) -> str:
    return _file_hash(file_path, hashlib.md5)


def file_sha256(file_path: str) -> str:
    return _file_hash(file_path, hashlib.sha256)


def file_sha512(file_path: str) -> str:
    return _file_hash(file_path, hashlib.sha512)


def file_sha384(file_path: str) -> str:
    return _file_hash(file_path, hashlib.sha384)


def file_sha1(file_path: str) -> str:
    return _file_hash(file_path, hashlib.sha1)


def file_sha224(file_path: str) -> str:
    return _file_hash(file_path, hashlib.sha224)


def str_md5(content: str, encoding: str = 'UTF-8') -> str:
    return str_hash(content, hashlib.md5, encoding)


def str_sha256(content: str, encoding: str = 'UTF-8') -> str:
    return str_hash(content, hashlib.sha256, encoding)


def str_sha512(content: str, encoding: str = 'UTF-8') -> str:
    return str_hash(content, hashlib.sha512, encoding)


def str_sha384(content: str, encoding: str = 'UTF-8') -> str:
    return str_hash(content, hashlib.sha384, encoding)


def str_sha1(content: str, encoding: str = 'UTF-8') -> str:
    return str_hash(content, hashlib.sha1, encoding)


def str_sha224(content: str, encoding: str = 'UTF-8') -> str:
    return str_hash(content, hashlib.sha224, encoding)


if __name__ == '__main__':
    print(file_md5(
        "/Users/mark/Documents/mark_projects/皇家小虎/HJXH/hjxh_express_match/data/2021-11/trd/trd_2021-11_东莞极兔.xlsx"))
