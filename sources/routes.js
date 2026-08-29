import {Router} from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import TaskController from "./app/controllers/TaskController";
import AuthMiddleware from "./app/middlewares/authentication";

const routes = new Router(); // "routes" armazena o Router onde as rotas serão criadas.

routes.post("/users", UserController.store);

routes.get("/sessions", SessionController.store);

routes.use(AuthMiddleware);

routes.put("/users", UserController.update);

routes.post("/tasks", TaskController.store);

routes.get("/tasks", TaskController.index);

routes.put("/tasks/{:task_id}", TaskController.update);


export default routes; // Exporta o routes para ser usado no "app.js".