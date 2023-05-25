import { saltValue } from '../src/utils/auth';
import db from './db.setup';

const clearDb = async () => {
  await db.user.deleteMany();
  await db.password.deleteMany();
  await db.forgotPassword.deleteMany();
  await db.resetPassword.deleteMany();
  await db.business.deleteMany();
};

const seed = async () => {
  console.log('Seeding the database...');
  await clearDb();

  //* Seed 3 businesses
  const business1 = await db.business.upsert({
    where: { name: 'One Business' },
    update: {},
    create: {
      code: '123456',
      name: 'One Business',
      officeType: 'Office_Park',
    },
  });

  const business2 = await db.business.upsert({
    where: { name: 'Two Business' },
    update: {},
    create: {
      code: '234567',
      name: 'Two Business',
      officeType: 'Downtown_Office',
    },
  });

  const business3 = await db.business.upsert({
    where: { name: 'Three Business' },
    update: {},
    create: {
      code: '345678',
      name: 'Three Business',
      officeType: 'Skyline',
    },
  });

  const michael1 = await db.user.upsert({
    where: { email: 'michael1@prisma.io' },
    update: {},
    create: {
      email: 'michael1@prisma.io',
      firstName: 'michael1',
      lastName: 'sanchez',
      displayName: 'michael1 sanchez',
      role: 'OWNER',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('red'),
        },
      },
      business: {
        connect: { id: business1.id },
      },
    },
  });

  const michael2 = await db.user.upsert({
    where: { email: 'michael2@prisma.io' },
    update: {},
    create: {
      email: 'michael2@prisma.io',
      firstName: 'michael2',
      lastName: 'sanchez',
      displayName: 'michael1 sanchez',
      role: 'OWNER',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('red'),
        },
      },
      business: {
        connect: { id: business2.id },
      },
    },
  });

  const michael3 = await db.user.upsert({
    where: { email: 'michael3@prisma.io' },
    update: {},
    create: {
      email: 'michael3@prisma.io',
      firstName: 'michael3',
      lastName: 'sanchez',
      displayName: 'michael3 sanchez',
      role: 'OWNER',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('red'),
        },
      },
      business: {
        connect: { id: business3.id },
      },
    },
  });

  const lisa1 = await db.user.upsert({
    where: { email: 'lisa1@prisma.io' },
    update: {},
    create: {
      email: 'lisa1@prisma.io',
      firstName: 'lisa1',
      lastName: 'sanchez',
      displayName: 'lisa1 sanchez',
      role: 'SUPERADMIN',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('blue'),
        },
      },
      business: {
        connect: { id: business1.id },
      },
    },
  });

  const lisa2 = await db.user.upsert({
    where: { email: 'lisa2@prisma.io' },
    update: {},
    create: {
      email: 'lisa2@prisma.io',
      firstName: 'lisa2',
      lastName: 'sanchez',
      displayName: 'lisa2 sanchez',
      role: 'SUPERADMIN',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('blue'),
        },
      },
      business: {
        connect: { id: business2.id },
      },
    },
  });

  const lisa3 = await db.user.upsert({
    where: { email: 'lisa3@prisma.io' },
    update: {},
    create: {
      email: 'lisa3@prisma.io',
      firstName: 'lisa3',
      lastName: 'sanchez',
      displayName: 'lisa3 sanchez',
      role: 'SUPERADMIN',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('blue'),
        },
      },
      business: {
        connect: { id: business3.id },
      },
    },
  });

  const lily1 = await db.user.upsert({
    where: { email: 'lily1@prisma.io' },
    update: {},
    create: {
      email: 'lily1@prisma.io',
      firstName: 'lily1',
      lastName: 'sanchez',
      displayName: 'lily1 sanchez',
      role: 'COMPANYADMIN',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('purple'),
        },
      },
      business: {
        connect: { id: business1.id },
      },
    },
  });

  const lily2 = await db.user.upsert({
    where: { email: 'lily2@prisma.io' },
    update: {},
    create: {
      email: 'lily2@prisma.io',
      firstName: 'lily2',
      lastName: 'sanchez',
      displayName: 'lily2 sanchez',
      role: 'COMPANYADMIN',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('purple'),
        },
      },
      business: {
        connect: { id: business2.id },
      },
    },
  });

  const lily3 = await db.user.upsert({
    where: { email: 'lily3@prisma.io' },
    update: {},
    create: {
      email: 'lily3@prisma.io',
      firstName: 'lily3',
      lastName: 'sanchez',
      displayName: 'lily3 sanchez',
      role: 'COMPANYADMIN',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('purple'),
        },
      },
      business: {
        connect: { id: business3.id },
      },
    },
  });

  const mila1 = await db.user.upsert({
    where: { email: 'mila1@prisma.io' },
    update: {},
    create: {
      email: 'mila1@prisma.io',
      firstName: 'mila1',
      lastName: 'sanchez',
      displayName: 'mila1 sanchez',
      role: 'MANAGER',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('green'),
        },
      },
      business: {
        connect: { id: business1.id },
      },
    },
  });

  const mila2 = await db.user.upsert({
    where: { email: 'mila2@prisma.io' },
    update: {},
    create: {
      email: 'mila2@prisma.io',
      firstName: 'mila2',
      lastName: 'sanchez',
      displayName: 'mila2 sanchez',
      role: 'MANAGER',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('green'),
        },
      },
      business: {
        connect: { id: business2.id },
      },
    },
  });

  const mila3 = await db.user.upsert({
    where: { email: 'mila3@prisma.io' },
    update: {},
    create: {
      email: 'mila3@prisma.io',
      firstName: 'mila3',
      lastName: 'sanchez',
      displayName: 'mila3 sanchez',
      role: 'MANAGER',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('green'),
        },
      },
      business: {
        connect: { id: business3.id },
      },
    },
  });

  const remi1 = await db.user.upsert({
    where: { email: 'remi1@prisma.io' },
    update: {},
    create: {
      email: 'remi1@prisma.io',
      firstName: 'remi1',
      lastName: 'sanchez',
      displayName: 'remi1 sanchez',
      role: 'USER',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('red'),
        },
      },
      business: {
        connect: { id: business1.id },
      },
    },
  });

  const remi2 = await db.user.upsert({
    where: { email: 'remi2@prisma.io' },
    update: {},
    create: {
      email: 'remi2@prisma.io',
      firstName: 'remi2',
      lastName: 'sanchez',
      displayName: 'remi2 sanchez',
      role: 'USER',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('red'),
        },
      },
      business: {
        connect: { id: business2.id },
      },
    },
  });

  const remi3 = await db.user.upsert({
    where: { email: 'remi3@prisma.io' },
    update: {},
    create: {
      email: 'remi3@prisma.io',
      firstName: 'remi3',
      lastName: 'sanchez',
      displayName: 'remi3 sanchez',
      role: 'USER',
      password: {
        create: {
          password: await saltValue('password'),
        },
      },
      forgotPassword: {
        create: {
          forgotPasswordQuestion: 'What is your favorite color?',
          forgotPasswordAnswer: await saltValue('red'),
        },
      },
      business: {
        connect: { id: business3.id },
      },
    },
  });

  const roomTest = await db.room.create({
    data: {
      name: 'test',
      description: 'this is a test',
      businessId: business1.id,
    },
  });

  const messageTest = await db.message.create({
    data: {
      messageBody: 'I am testing this message',
      userId: michael1.id,
      roomId: roomTest.id,
      businessId: business1.id,
    },
  });

  console.log({
    business1: {
      business1,
      michael1,
      lisa1,
      lily1,
      mila1,
      remi1,
    },
    business2: {
      business2,
      michael2,
      lisa2,
      lily2,
      mila2,
      remi2,
    },
    business3: {
      business3,
      michael3,
      lisa3,
      lily3,
      mila3,
      remi3,
    },
    roomTest,
    messageTest,
  });
};

seed()
  .then(() => {
    console.log('Seeding complete');
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
