import { get_all, get_by_month, get_by_week } from "../controllers/statistics.controller";
import authorize from "../middlewares/auth";

const statisticsRoutes = (app: any) => {
    app.get('/statistics', authorize, get_all);
    app.get('/statistics-month', authorize, get_by_month);
    app.get("/statistics-week", authorize, get_by_week);
}

export default statisticsRoutes;