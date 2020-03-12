import App from "../../src/app";
import controllers from "../../src/api/controllers/index";


export const server = () => {
    const app = new App(controllers.map(Controller => new Controller()));
    app.listen();
}
export const close =async () => { 
    process.exit(1);
}
