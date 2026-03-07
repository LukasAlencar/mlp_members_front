//general.routes.ts

import { backup } from "../controllers/general.controller";
import authorize from "../middlewares/auth";

const generalRoutes = (app: any) => {
    app.post('/backup', authorize, backup);
}

export default generalRoutes;
