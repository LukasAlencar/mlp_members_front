import { Request, Response } from "express";
import { countAddedMembersByMonth, countAddedMembersByWeek, countAddedMembersTotal, countRemovedMembersByMonth, countRemovedMembersByWeek, countRemovedMembersTotal } from "../repositories/statistics.repository";

export const get_all = async (req: Request, res: Response) => {
    try {

        const members_addeds = await countAddedMembersTotal();
        const members_removeds = await countRemovedMembersTotal();

        return res.status(200).send({ members_addeds, members_removeds });
    } catch (error) {
        res.status(500).send({ error });
    }
}

export const get_by_month = async (req: Request, res: Response) => {
    try {

        const members_addeds = await countAddedMembersByMonth();
        const members_removeds = await countRemovedMembersByMonth();

        return res.status(200).send({ members_addeds, members_removeds });
    } catch (error) {
        res.status(500).send({ error });
    }
}

export const get_by_week = async (req: Request, res: Response) => {
    try {

        const members_addeds = await countAddedMembersByWeek();
        const members_removeds = await countRemovedMembersByWeek();

        return res.status(200).send({ members_addeds, members_removeds });
    } catch (error) {
        res.status(500).send({ error });
    }
}