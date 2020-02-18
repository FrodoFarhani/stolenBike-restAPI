import { EOL } from "os";
import { IObject } from "../types/object";

class Logger {
	public info(message: string, obj?: IObject) {
		this.log(message, obj);
	}

	public error(message: string, obj?: IObject) {
		this.log(message, obj);
	}

	private log(message: string, obj?: IObject) {
		process.stdout.write(`${message} ${JSON.stringify(obj)}${EOL}${EOL}`);
	}
}

export default new Logger();
