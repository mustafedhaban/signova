import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PUBLIC_TEMPLATES = [
  {
    name: 'Professional Classic',
    description: 'Traditional side-by-side layout',
    category: 'professional',
    tags: '["classic","formal","ngo"]',
    isPublic: true,
  },
  {
    name: 'Modern Minimal',
    description: 'Clean design with blue accent bar',
    category: 'modern',
    tags: '["minimal","clean","modern"]',
    isPublic: true,
  },
  {
    name: 'Corporate Bold',
    description: 'Dark navy panel with colored border',
    category: 'corporate',
    tags: '["bold","corporate","formal"]',
    isPublic: true,
  },
  {
    name: 'Creative Colorful',
    description: 'Vibrant gradient design',
    category: 'creative',
    tags: '["colorful","creative","ngo"]',
    isPublic: true,
  },
  {
    name: 'Executive Formal',
    description: 'Conservative gold-accented layout',
    category: 'executive',
    tags: '["formal","executive","ngo"]',
    isPublic: true,
  },
  {
    name: 'Tech Startup',
    description: 'Dark terminal-inspired design',
    category: 'tech',
    tags: '["tech","startup","modern"]',
    isPublic: true,
  },
];

async function main() {
  const existing = await prisma.template.count({ where: { isPublic: true } });
  if (existing >= PUBLIC_TEMPLATES.length) {
    console.log(`Skipping seed: ${existing} public template(s) already in database.`);
    return;
  }

  await prisma.template.createMany({
    data: PUBLIC_TEMPLATES,
  });

  console.log(`Seeded up to ${PUBLIC_TEMPLATES.length} public templates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
