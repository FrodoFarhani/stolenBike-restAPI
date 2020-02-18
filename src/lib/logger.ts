/* eslint-disable no-unused-expressions */
import { EOL } from "os";
import { IObject } from "../types/object";

class Logger {
	public info(message: string, obj?: IObject) {
		this.log("\x1b[32m", "INFO", message, obj);
	}

	public error(message: string, obj?: IObject) {
		this.log("\x1b[31m", "ERROR", message, obj);
	}

	public warn(message: string, obj?: IObject) {
		this.log("\x1b[33m", "WARN", message, obj);
	}

	public debug(message: string, obj?: IObject) {
		this.log("\x1b[34m", "DEBUG", message, obj);
	}

	private log(style: string, logType: string, message: string, obj?: IObject) {
		const datetime = new Date();
		let errObj = "";
		obj ? (errObj = JSON.stringify(obj)) : (errObj = "");
		console.log(
			style,
			`${logType} | ${datetime
				.toISOString()
				.slice(0, 19)} | ${message} ${errObj}${EOL}${EOL}`
		);
	}
}

export default new Logger();
