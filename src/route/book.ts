import { Response } from 'express';
import { Request } from 'express';
import { Book } from '../entity/Book';
import { User } from "../entity/User";
const routerBook = (app, connection, url) => {

  const bookRepository = connection.getRepository(Book)
  const userRepository = connection.getRepository(User);
  app.get(`${url}`, async function (req: Request, res: Response) {
    const books = await bookRepository.find({
      select : ['id', 'name', 'user'],
      relations : ['user']
    });
    console.log({ books })
    
    res.json(books);
  });

  app.get(`${url}/:id`, async function (req: Request, res: Response) {
    const result = await bookRepository.findOne(req.params.id);
    return res.send(result);
  });

  app.post(`${url}`, async function (req: Request, res: Response) {
    const book = new Book();
    const { name, authorId } = req.body;
    console.log(req.body);
    
    // const specificAuthor = await userRepository.findOne(authorId)
    // if(!specificAuthor) {
    //   return res.json({ 
    //     message : "User doesn't exist"
    //   })
    // }

    // book.authorId = author;
    book.name = name;
    // book.user = specificAuthor;
    await connection.manager.save(book);
    console.log("Saved a new user with id: " + book.id);
    return res.json(book);
  });

  app.put(`${url}/:id`, async function (req: Request, res: Response) {
    const book = await bookRepository.findOne(req.params.id);
    bookRepository.merge(book, req.body);
    const results = await bookRepository.save(book);
    return res.send(results);
  });

  app.delete(`${url}/:id`, async function (req: Request, res: Response) {
    const results = await bookRepository.delete(req.params.id);
    return res.send(results);
  });

}

export { routerBook }