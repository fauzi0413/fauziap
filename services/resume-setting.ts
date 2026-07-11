import { resumeSettingRepository } from "@/repositories/resume-setting";

export interface ResumeSettingPayload {
  showExperience?: boolean;
  showEducation?: boolean;
  showProjects?: boolean;
  showCertificates?: boolean;
  showSkills?: boolean;
  sectionOrder?: string[];
  isAtsOptimized?: boolean;
}

export class ResumeSettingService {
  getSetting() {
    return resumeSettingRepository.getSetting();
  }

  async updateSetting(data: ResumeSettingPayload) {
    const current = await this.getSetting();

    const payload = {
      ...(data.showExperience !== undefined && { showExperience: data.showExperience }),
      ...(data.showEducation !== undefined && { showEducation: data.showEducation }),
      ...(data.showProjects !== undefined && { showProjects: data.showProjects }),
      ...(data.showCertificates !== undefined && { showCertificates: data.showCertificates }),
      ...(data.showSkills !== undefined && { showSkills: data.showSkills }),
      ...(data.isAtsOptimized !== undefined && { isAtsOptimized: data.isAtsOptimized }),
      ...(data.sectionOrder !== undefined && { sectionOrder: JSON.stringify(data.sectionOrder) }),
    };

    return resumeSettingRepository.update(current.id, payload);
  }
}

export const resumeSettingService = new ResumeSettingService();
