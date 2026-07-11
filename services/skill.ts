import { skillRepository } from "@/repositories/skill";

export interface SkillPayload {
  technologyId: string;
  level?: string | null;
  category?: string | null;
  isPublic?: boolean;
  displayOrder?: number;
}

export class SkillService {
  getAll() {
    return skillRepository.findAll();
  }

  getById(id: string) {
    return skillRepository.findById(id);
  }

  create(data: SkillPayload) {
    return skillRepository.create({
      technology: { connect: { id: data.technologyId } },
      level: data.level ?? null,
      category: data.category ?? null,
      isPublic: data.isPublic ?? true,
      displayOrder: data.displayOrder ?? 0,
    });
  }

  update(id: string, data: Partial<SkillPayload>) {
    return skillRepository.update(id, {
      ...(data.technologyId && { technology: { connect: { id: data.technologyId } } }),
      ...(data.level !== undefined && { level: data.level }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    });
  }

  delete(id: string) {
    return skillRepository.delete(id);
  }
}

export const skillService = new SkillService();
