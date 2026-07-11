import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class CertificateRepository {
  findAll() {
    return prisma.certificate.findMany({
      orderBy: { issueDate: "desc" },
    });
  }

  findById(id: string) {
    return prisma.certificate.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.CertificateCreateInput) {
    return prisma.certificate.create({ data });
  }

  update(id: string, data: Prisma.CertificateUpdateInput) {
    return prisma.certificate.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.certificate.delete({ where: { id } });
  }
}

export const certificateRepository = new CertificateRepository();
