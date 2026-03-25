import { User } from "@prisma/client";
import { prisma } from "../services/prisma";

export const createUser = async (data: User) => {
    const user = await prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
            createdAt: true,
            updatedAt: true,
        }
    });
    return user;
};

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
            createdAt: true,
            updatedAt: true,
        }
    });
    return user;
};

export const getUserByEmailAndPassword = async (email: string, password: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email,
            password
        },
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
            createdAt: true,
            updatedAt: true,
        }
    });
    return user;
}