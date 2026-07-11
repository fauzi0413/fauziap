import { portfolioRepository, type BlogListParams, type ProjectListParams, type ProfilePayload } from "@/repositories/portfolio";

export { type ProfilePayload } from "@/repositories/portfolio";

export class PortfolioService {
  getProfile() {
    return portfolioRepository.getProfile();
  }

  upsertProfile(data: ProfilePayload) {
    return portfolioRepository.upsertProfile(data);
  }

  getSkills() {
    return portfolioRepository.getSkills();
  }

  getTechnologies() {
    return portfolioRepository.getTechnologies();
  }

  getExperiences() {
    return portfolioRepository.getExperiences();
  }

  getEducations() {
    return portfolioRepository.getEducations();
  }

  getCertificates() {
    return portfolioRepository.getCertificates();
  }

  getProjects(params?: ProjectListParams) {
    return portfolioRepository.getProjects(params);
  }

  getFeaturedProjects() {
    return portfolioRepository.getFeaturedProjects();
  }

  getProjectBySlug(slug: string) {
    return portfolioRepository.getProjectBySlug(slug);
  }

  getRelatedProjects(projectId: string, technologyIds: string[]) {
    return portfolioRepository.getRelatedProjects(projectId, technologyIds);
  }

  getBlogs(params?: BlogListParams) {
    return portfolioRepository.getBlogs(params);
  }

  getBlogBySlug(slug: string) {
    return portfolioRepository.getBlogBySlug(slug);
  }

  getRelatedBlogs(currentSlug: string) {
    return portfolioRepository.getRelatedBlogs(currentSlug);
  }

  createContactMessage(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    return portfolioRepository.createContactMessage(data);
  }
}

export const portfolioService = new PortfolioService();
