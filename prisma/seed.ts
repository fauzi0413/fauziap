import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "password123";
const adminName = process.env.SEED_ADMIN_NAME ?? "Super Admin";

async function main() {
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const admin = existingAdmin
    ? await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        name: adminName,
        password: hashedPassword,
        role: "ADMIN",
      },
    })
    : await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {
      fullName: adminName,
    },
    create: {
      userId: admin.id,
      fullName: adminName,
      title: "Fullstack Web Developer",
      shortBio: "Personal Portfolio CMS siap dikelola dari dashboard admin.",
      fullBio: "Lengkapi biodata, pengalaman, pendidikan, project, dan sertifikat melalui dashboard admin.",
      location: "Indonesia",
    },
  });
  
  console.log({
    message: "Admin user seeded successfully",
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
