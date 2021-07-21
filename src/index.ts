import "reflect-metadata";
import * as express from "express";
var bodyParser = require('body-parser')
import { createConnection } from "typeorm";
import { Request, Response } from "express";

import { Book } from './entity/Book';
import { User } from "./entity/User";
import { routerBook } from "./route/book";

createConnection({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "testTypeOrms",
    entities: [
        __dirname + "/entity/*.ts"
    ],
    synchronize: false,
}).then(async connection => {
    const testUser = connection.getMongoRepository(User);
    const userRepository = connection.getRepository(User);
    const bookRepository = connection.getRepository(Book)

    // create and setup express app
    const app = express();
    app.use(express.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
    app.use(bodyParser.json())


    app.get("/", async function (req: Request, res: Response) {
        return res.redirect("/users")
    });

    app.get("/users", async function (req: Request, res: Response) {
        const users = await testUser.find({
            select: ['firstName', 'books'],
            relations: ['books', 'book.user']
        });
        console.log({ users })

        // Query Builder is not supported by MongoDB
        // const testQuery = await testUser.createQueryBuilder('user.books').getMany();
        // console.log({ testQuery });
        // let userRe = await bookRepository.find({ relations: ["author"] });
        // console.log({ userRe });
        res.json(users);
    });

    app.get("/users/:id", async function (req: Request, res: Response) {
        // here we will have logic to return user by id
        const result = await userRepository.findOne(req.params.id, {
            relations: ['books', 'books.author']
        });
        console.log({ result });
        return res.send(result);
    });

    app.post("/users", async function (req: Request, res: Response) {
        // here we will have logic to save a user
        const user = new User();

        const { firstName, lastName, age } = req.body;
        const book1 = new Book();
        book1.name = "ashiashdiasd";
        await connection.manager.save(book1);

        const book2 = new Book();
        book2.name = "12312321321321";
        await connection.manager.save(book2);
        
        user.firstName = firstName;
        user.lastName = lastName;
        user.age = +age;
        user.books = [book1, book2]
        await connection.manager.save(user);
        console.log("Saved a new user with id: " + user.id);
        res.json(user);
    });

    app.put("/users/:id", async function (req: Request, res: Response) {
        const user = await userRepository.findOne(req.params.id);
        userRepository.merge(user, req.body);
        const results = await userRepository.save(user);
        return res.send(results);
    });

    app.delete("/users/:id", async function (req: Request, res: Response) {
        const results = await userRepository.delete(req.params.id);
        return res.send(results);
    });

    routerBook(app, connection, '/books');
    // start express server
    app.listen(3000, () => {
        console.log("App running on port 3000");
    });

}).catch(error => console.log(error));


