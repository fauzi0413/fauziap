import { certificateRepository } from "@/repositories/certificate";

export interface CertificatePayload {
  name: string;
  issuer: string;
  issueDate: string; // ISO date string "YYYY-MM-DD"
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  image?: string | null;
  isPublic?: boolean;
}

export class CertificateService {
  getAll() {
    return certificateRepository.findAll();
  }

  getById(id: string) {
    return certificateRepository.findById(id);
  }

  create(data: CertificatePayload) {
    return certificateRepository.create({
      name: data.name,
      issuer: data.issuer,
      issueDate: new Date(data.issueDate),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      credentialId: data.credentialId ?? null,
      credentialUrl: data.credentialUrl ?? null,
      image: data.image ?? null,
      isPublic: data.isPublic ?? true,
    });
  }

  update(id: string, data: Partial<CertificatePayload>) {
    return certificateRepository.update(id, {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.issuer !== undefined && { issuer: data.issuer }),
      ...(data.issueDate !== undefined && { issueDate: new Date(data.issueDate) }),
      ...(data.expiryDate !== undefined && { expiryDate: data.expiryDate ? new Date(data.expiryDate) : null }),
      ...(data.credentialId !== undefined && { credentialId: data.credentialId }),
      ...(data.credentialUrl !== undefined && { credentialUrl: data.credentialUrl }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
    });
  }

  delete(id: string) {
    return certificateRepository.delete(id);
  }
}

export const certificateService = new CertificateService();
