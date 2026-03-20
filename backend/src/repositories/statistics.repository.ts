import { prisma } from "../services/prisma";


export const incrementMemberAdded = async (memberId: string) => {

    try {
        await prisma.statistics.create({
            data: {
                memberId,
                memberAdded: true,
            }
        })

        return { success: true, message: 'Estatística criada com sucesso' };
    } catch (error) {
        return { success: false, message: 'Erro ao criar estatística' };
    }
};

export const incrementMemberRemoved = async (memberId: string) => {
    try {
        await prisma.statistics.create({
            data: {
                memberId,
                memberRemoved: true,
            }
        })

        return { success: true, message: 'Estatística criada com sucesso' };
    } catch (error) {
        return { success: false, message: 'Erro ao criar estatística' };
    }
};

export const countAddedMembersTotal = async () => {
    const count = await prisma.statistics.count({
        where: {
            memberAdded: true
        }
    });

    return count;
}

export const countAddedMembersByMonth = async () => {
    const count = await prisma.statistics.count({
        where: {
            memberAdded: true,
            date: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            }
        }
    });

    return count;
}

export const countAddedMembersByWeek = async () => {
    const count = await prisma.statistics.count({
        where: {
            memberAdded: true,
            date: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()),
                lte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (6 - new Date().getDay()))
            }
        }
    });

    return count;
}

export const countRemovedMembersTotal = async () => {
    const count = await prisma.statistics.count({
        where: {
            memberRemoved: true
        }
    });

    return count;
}

export const countRemovedMembersByMonth = async () => {
    const count = await prisma.statistics.count({
        where: {
            memberRemoved: true,
            date: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            }
        }
    });

    return count;
}

export const countRemovedMembersByWeek = async () => {
    const count = await prisma.statistics.count({
        where: {
            memberRemoved: true,
            date: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()),
                lte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (6 - new Date().getDay()))
            }
        }
    });

    return count;
}