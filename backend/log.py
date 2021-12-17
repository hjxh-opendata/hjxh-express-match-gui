import datetime
import logging.handlers
import os

LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
LOG_ALL_PATH = os.path.join(LOG_DIR, "all.log")
LOG_ERR_PATH = os.path.join(LOG_DIR, "err.log")

log = logging.getLogger('mylogger')
log.setLevel(logging.DEBUG)

rf_handler = logging.handlers.TimedRotatingFileHandler(
    LOG_ALL_PATH, when='midnight', interval=1, backupCount=7, atTime=datetime.time(0, 0, 0, 0))
rf_handler.setFormatter(logging.Formatter(
    "%(asctime)s - %(levelname)s - %(funcName)s - %(message)s"))

f_handler = logging.FileHandler(LOG_ERR_PATH)
f_handler.setLevel(logging.ERROR)
f_handler.setFormatter(logging.Formatter(
    "%(asctime)s - %(levelname)s - %(filename)s[:%(lineno)d] - %(funcName)s - %(message)s"))

log.addHandler(rf_handler)
log.addHandler(f_handler)

# logger.debug('debug message')
# logger.info('info message')
# logger.warning('warning message')
# logger.error('error message')
# logger.critical('critical message')
