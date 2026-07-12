import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Prisma } from "@prisma/client";

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    technologies: { 
      include: { 
        technology: {
          include: { skills: { select: { displayOrder: true } } }
        } 
      } 
    };
    images: true;
  };
}>;

export function ProjectCard({ project }: { project: ProjectWithRelations }) {
  const image = project.thumbnail ?? project.images[0]?.imageUrl;
  
  const sortedTechnologies = [...project.technologies].sort((a, b) => {
    const orderA = a.technology.skills?.[0]?.displayOrder ?? 999;
    const orderB = b.technology.skills?.[0]?.displayOrder ?? 999;
    return orderA - orderB;
  });

  return (
    <article className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[16/10] bg-black/5">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={project.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-black/35">
            Project preview
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-black">{project.title}</h2>
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`Detail ${project.title}`}
            className="rounded-md border text-black border-black/10 p-2 transition hover:bg-black hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        {project.shortDescription ? (
          <p className="mt-3 min-h-16 text-sm leading-6 text-black/58">{project.shortDescription}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          {sortedTechnologies.slice(0, 5).map(({ technology }) => (
            <span key={technology.id} className="inline-flex items-center gap-1.5 rounded-md bg-black/[0.06] px-2.5 py-1 text-xs font-semibold text-black/58">
              {technology.icon && technology.icon.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={technology.icon} alt={technology.name} className="h-3.5 w-3.5 object-contain" />
              ) : (
                technology.icon ? <span>{technology.icon}</span> : null
              )}
              <span>{technology.name}</span>
            </span>
          ))}
          {sortedTechnologies.length > 5 && (
            <span className="inline-flex items-center justify-center rounded-md bg-black/[0.06] px-2.5 py-1 text-xs font-semibold text-black/58">
              +{sortedTechnologies.length - 5}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

