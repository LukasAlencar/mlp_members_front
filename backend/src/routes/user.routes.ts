import { create } from "../controllers/user.controller";

const userRoutes = (app: any) => {
    app.post('/create-user', create);
}

export default userRoutes;