import HttpException from "./HttpException";

class NotImplementedException extends HttpException {
	constructor() {
		super(404, `Your requested path is not defined`);
	}
}

export default NotImplementedException;
