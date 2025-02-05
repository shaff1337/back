import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
    /**
     * Create event log
     * @param data
     */
    create: async (data: { route: string, ip: string, timestamp: Date, userId: number }) => {
        return prisma.eventLog.create({
            data,
        });
    },
};