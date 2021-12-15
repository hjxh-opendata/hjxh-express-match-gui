from numpy import disp
import pandas as pd
from collections import defaultdict

ENCODINGS = ["ISO-8859-1", "ISO-8859-1",
             "GB2312", "UTF-8", "GBK", "UTF-16"]


def convert_encoding(s: str, encoding: str = None, decoding: str = None):
    try:
        return s.encode(encoding).decode(decoding)
    except UnicodeDecodeError as e:
        return "*"
    except UnicodeEncodeError as e:
        return "#"
    except AttributeError as e:
        return "-"
    raise Exception("must specify exact one encoding/decoding")


def traverse_converting_encoding(s):
    m = defaultdict(dict)
    for e in ENCODINGS:
        for d in ENCODINGS:
            m[e][d] = convert_encoding(s, e, d)
    # for c in ENCODINGS:
    #     m[c]["encoding"] = convert_encoding(s, encoding=c)
    #     m[c]["decoding"] = convert_encoding(s, decoding=c)
    df = pd.DataFrame(m)
    disp(df)


if __name__ == "__main__":
    traverse_converting_encoding("ภศทปผซอรtrd")
