import { prisma } from "../services/prisma";

export const createMember = async (data: any) => {

    try {
        const member = await prisma.member.create({
            data,
        });
        return {success: true, message: 'Membro criado com sucesso', member};
    } catch (error) {
        return { success: false, message: error, member: null };
    }
};

export const getAllMembers = async () => {
    const members = await prisma.member.findMany();
    return members;
}

export const getMemberById = async (id: string) => {
    const member = await prisma.member.findUnique({
        where: {
            id
        }
    });
    return member;
}

export const updateMember = async (id: string, data: any) => {

    const member = await prisma.member.update({
        where: {
            id
        },
        data
    });
    return member;
}

export const deleteMember = async (id: string) => {
    const member = await prisma.member.delete({
        where: {
            id
        }
    });
    return member;
}

export const getCountMembers = async () => {
    const count = await prisma.member.count();
    return count;
}