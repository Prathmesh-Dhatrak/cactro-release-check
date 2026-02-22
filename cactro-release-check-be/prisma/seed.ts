import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seeds the database with sample release data for development.
 */
async function seed(): Promise<void> {
  console.log('[SEED] Starting database seed...');

  /* Clear existing data */
  await prisma.release.deleteMany();

  /* Create sample releases */
  const releases = [
    {
      name: 'Version 1.0.1',
      date: new Date('2022-09-20'),
      additionalInfo: 'Initial patch release with bug fixes.',
      completedSteps: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      name: 'Version 1.0.2',
      date: new Date('2022-09-28'),
      additionalInfo: 'Security patch and performance improvements.',
      completedSteps: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      name: 'Version 1.1.0',
      date: new Date('2022-10-10'),
      additionalInfo: 'New feature release with dashboard improvements.',
      completedSteps: [0, 1, 2],
    },
    {
      name: 'Version 2.0-beta2',
      date: new Date('2022-11-01'),
      additionalInfo: null,
      completedSteps: [],
    },
  ];

  for (const release of releases) {
    await prisma.release.create({ data: release });
  }

  console.log(`[SEED] Created ${releases.length} sample releases`);
  console.log('[SEED] Database seeding completed successfully');
}

seed()
  .catch((error: unknown) => {
    console.error('[SEED] Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
