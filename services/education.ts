import { educationRepository } from "@/repositories/education";

export interface EducationPayload {
  institution: string;
  institutionLogo?: string | null;
  degree: string;
  major?: string | null;
  startDate: string; // ISO date string "YYYY-MM-DD"
  endDate?: string | null;
  gpa?: string | null;
  predicate?: string | null;
  description?: string | null;
  finalProjectId?: string | null;
}

export class EducationService {
  getAll() {
    return educationRepository.findAll();
  }

  getById(id: string) {
    return educationRepository.findById(id);
  }

  create(data: EducationPayload) {
    return educationRepository.create({
      institution: data.institution,
      institutionLogo: data.institutionLogo ?? null,
      degree: data.degree,
      major: data.major ?? null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      gpa: data.gpa ?? null,
      predicate: data.predicate ?? null,
      description: data.description ?? null,
      finalProject: data.finalProjectId ? { connect: { id: data.finalProjectId } } : undefined,
    });
  }

  update(id: string, data: Partial<EducationPayload>) {
    return educationRepository.update(id, {
      ...(data.institution !== undefined && { institution: data.institution }),
      ...(data.institutionLogo !== undefined && { institutionLogo: data.institutionLogo }),
      ...(data.degree !== undefined && { degree: data.degree }),
      ...(data.major !== undefined && { major: data.major }),
      ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      ...(data.gpa !== undefined && { gpa: data.gpa }),
      ...(data.predicate !== undefined && { predicate: data.predicate }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.finalProjectId !== undefined && {
        finalProject: data.finalProjectId ? { connect: { id: data.finalProjectId } } : { disconnect: true },
      }),
    });
  }

  delete(id: string) {
    return educationRepository.delete(id);
  }
}

export const educationService = new EducationService();
