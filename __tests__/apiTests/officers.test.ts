import request = require('supertest');
import App from "../../src/app";
import mockData from "../../__mocks__/mockData";



describe("api", () => {
    it("/", async () => {
        const result = await request("http://localhost:3000")
            .get('/api/test/669')
            .set('Content-Type', "application/x-www-form-urlencoded");
        console.log("RESULT:",result.body);
        
        expect(result.status).toBe(200);
    });       
});
