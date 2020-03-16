import request from "supertest";
import App from "../../src/app";
import controllers from "../../src/api/controllers";
import express from "express"
import bodyParser from "body-parser";
import setup from "../__dbSetup__";
import { getConnectionOptions, createConnection } from "typeorm";
import { connect, disconnect } from "../../src/config/typeorm";

setup();
const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

controllers.forEach(controller => {
    app.use("/api",new controller().router);
});

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});

describe("Test the root path",  () => {
    test("It should response the GET method", async () => {
        await connect();
        const response = await request(app)
            .get("/api/officer/669");
            console.log("response:",response);
        
        expect(response.status).toBe(200);
        
    });
});