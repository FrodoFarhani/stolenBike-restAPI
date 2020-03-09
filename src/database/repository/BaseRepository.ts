import { Repository } from "typeorm";

export default class BaseRepository<T> extends Repository<T> {}
