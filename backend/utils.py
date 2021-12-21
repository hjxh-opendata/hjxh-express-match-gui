from const import SERVER_FILES_DIR, ALLOWED_FILE_STANDS, ErrorType


def _get_file_path(file_name: str):
    return SERVER_FILES_DIR + file_name


def _get_df_file_path(file_name: str):
    i = 0
    try:
        i = file_name.rindex(".")
    except Exception as e:
        pass
    finally:
        return _get_file_path(file_name[:i] + "_df.csv")


def _try_to_get_file_stand(file_name: str):
    if file_name.startswith("erp_"):
        return "erp"
    elif file_name.startswith("trd_"):
        return "trd"
    else:
        raise Exception(ErrorType.FileStandInvalid, {"file_name": file_name, "valid_stands": ALLOWED_FILE_STANDS})

