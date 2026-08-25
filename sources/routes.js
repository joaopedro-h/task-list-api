import {Router} from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import AuthMiddleware from "./app/middlewares/authentication";

const routes = new Router();

routes.post("/users", UserController.store);

routes.get("/sessions", SessionController.store);

routes.use(AuthMiddleware);

routes.put("/users", UserController.update);


export default routes;