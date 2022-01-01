import { Ping } from '../heartBeats/channels';
import { RequestParseFile } from '../parseFile/channels';
import { RequestQueryDatabase } from '../queryDB/channels';
import { RequestSelectFile } from '../selectFile/channels';

export type Channels = Ping | RequestSelectFile | RequestParseFile | RequestQueryDatabase;
