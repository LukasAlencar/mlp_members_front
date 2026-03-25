import { create, delete_member, exportToExcel, export_members_csv, get_all, get_birthday_people_of_month, get_count_all_members, get_member, update_member } from "../controllers/member.controller";
import authorize from "../middlewares/auth";

const memberRoutes = (app: any) => {
    app.post('/member', authorize, create);
    app.get('/member', authorize, get_all);
    app.get('/member/:id', authorize, get_member);
    app.put('/member/:id', authorize, update_member);
    app.delete('/member/:id', authorize, delete_member);
    app.get('/member/export/csv', authorize, export_members_csv);
    app.get("/member/export/excel", authorize, exportToExcel);
    app.get("/member-birthday", authorize, get_birthday_people_of_month);
    app.get("/member-count", authorize, get_count_all_members);
}

export default memberRoutes;