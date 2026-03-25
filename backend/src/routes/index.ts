import authRoutes from "./auth.routes";
import generalRoutes from "./general.routes";
import memberRoutes from "./member.routes";
import statisticsRoutes from "./statistics.routes";
import userRoutes from './user.routes';

const routes = (app: any) => {
    memberRoutes(app);
    userRoutes(app);
    authRoutes(app);
    statisticsRoutes(app);
    generalRoutes(app);
}

export default routes;
