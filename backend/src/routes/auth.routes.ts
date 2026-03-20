import {authenticate, verifySession} from "../controllers/auth.controller"

const authRoutes = (app: any) => {
    app.post("/login", authenticate)
    app.post("/verifySession", verifySession)
}

export default authRoutes;