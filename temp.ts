import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.profile.findFirst().then(console.log).finally(() => prisma.$disconnect());
