import { technologyRepository } from "@/repositories/technology";

export interface TechnologyPayload {
  name: string;
  icon?: string;
  slug?: string;
}

export class TechnologyService {
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async getAll() {
    return technologyRepository.findAll();
  }

  async getById(id: string) {
    return technologyRepository.findById(id);
  }

  async create(data: TechnologyPayload) {
    const slug = data.slug || this.generateSlug(data.name);
    
    // Check for uniqueness
    const existing = await technologyRepository.findBySlug(slug);
    if (existing) {
      throw new Error(`Technology with slug '${slug}' already exists.`);
    }

    return technologyRepository.create({
      name: data.name,
      slug,
      icon: data.icon,
    });
  }

  async update(id: string, data: Partial<TechnologyPayload>) {
    let slug = data.slug;
    
    if (data.name && !slug) {
      slug = this.generateSlug(data.name);
    }

    if (slug) {
      const existing = await technologyRepository.findBySlug(slug);
      if (existing && existing.id !== id) {
        throw new Error(`Technology with slug '${slug}' already exists.`);
      }
    }

    return technologyRepository.update(id, {
      ...(data.name && { name: data.name }),
      ...(slug && { slug }),
      ...(data.icon !== undefined && { icon: data.icon }),
    });
  }

  async delete(id: string) {
    return technologyRepository.delete(id);
  }
}

export const technologyService = new TechnologyService();
