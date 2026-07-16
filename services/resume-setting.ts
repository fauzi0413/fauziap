import { resumeSettingRepository } from "@/repositories/resume-setting";

export interface ResumeSettingPayload {
  showExperience?: boolean;
  showEducation?: boolean;
  showProjects?: boolean;
  showCertificates?: boolean;
  showSkills?: boolean;
  sectionOrder?: string[];
  isAtsOptimized?: boolean;
  dataLimitMode?: string;
}

export class ResumeSettingService {
  getSetting() {
    return resumeSettingRepository.getSetting();
  }

  async updateSetting(data: ResumeSettingPayload) {
    const current = await this.getSetting();

    let parsed: any = { order: ["experience", "education", "skills", "projects", "certificates"], mode: "ALL" };
    try {
      const raw = current.sectionOrder ? JSON.parse(current.sectionOrder) : [];
      if (Array.isArray(raw)) {
        parsed.order = raw.length > 0 ? raw : parsed.order;
      } else {
        parsed = { ...parsed, ...raw };
      }
    } catch {}

    const newOrder = data.sectionOrder !== undefined ? data.sectionOrder : parsed.order;
    const newMode = data.dataLimitMode !== undefined ? data.dataLimitMode : parsed.mode;
    
    const sectionOrderStr = JSON.stringify({ order: newOrder, mode: newMode });

    const payload = {
      ...(data.showExperience !== undefined && { showExperience: data.showExperience }),
      ...(data.showEducation !== undefined && { showEducation: data.showEducation }),
      ...(data.showProjects !== undefined && { showProjects: data.showProjects }),
      ...(data.showCertificates !== undefined && { showCertificates: data.showCertificates }),
      ...(data.showSkills !== undefined && { showSkills: data.showSkills }),
      ...(data.isAtsOptimized !== undefined && { isAtsOptimized: data.isAtsOptimized }),
      sectionOrder: sectionOrderStr,
    };

    return resumeSettingRepository.update(current.id, payload);
  }
}

export const resumeSettingService = new ResumeSettingService();
