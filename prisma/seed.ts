import { Business, User } from '@prisma/client';
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
      // business: {
      //   connect: { id: business1.id },
      // },
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
      // business: {
      //   connect: { id: business2.id },
      // },
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
      // business: {
      //   connect: { id: business3.id },
      // },
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

  const business1Users = await db.user.findMany({
    where: {
      businessId: business1.id,
    },
  });

  const business2Users = await db.user.findMany({
    where: {
      businessId: business2.id,
    },
  });

  const business3Users = await db.user.findMany({
    where: {
      businessId: business3.id,
    },
  });

  const officePark = [
    {
      name: 'Conference Room 1',
      description: 'Max 50 users',
      capacity: 50,
    },
    {
      name: 'Conference Room 2',
      description: 'Max 50 users',
      capacity: 50,
    },
    {
      name: 'Break Room',
      description: 'Max 20 users',
      capacity: 20,
    },
  ];

  const downtownOffice = [
    {
      name: 'Conference Room 1',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 2',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 3',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 4',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 5',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Break Room 1',
      description: 'Max 20 users',
      capacity: 20,
    },
    {
      name: 'Break Room 2',
      description: 'Max 20 users',
      capacity: 20,
    },
  ];

  const skyline = [
    {
      name: 'Conference Room 1',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 2',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 3',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 4',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 5',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 6',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 7',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 8',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 9',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Conference Room 10',
      description: 'Max 100 users',
      capacity: 100,
    },
    {
      name: 'Break Room 1',
      description: 'Max 20 users',
      capacity: 20,
    },
    {
      name: 'Break Room 2',
      description: 'Max 20 users',
      capacity: 20,
    },
    {
      name: 'Break Room 3',
      description: 'Max 20 users',
      capacity: 20,
    },
    {
      name: 'Auditorium',
      description: 'Max 250 users',
      capacity: 250,
    },
    {
      name: 'Cafeteria',
      description: 'Max 100 users',
      capacity: 100,
    },
  ];

  const createRoomsList = async (
    business: Business,
    offices: 'Office_Park' | 'Downtown_Office' | 'Skyline',
    users: User[]
  ) => {
    for (let count = 0; count < users.length; count++) {
      const user = users[count];
      if (user.role === 'USER') {
        await db.room.create({
          data: {
            name: 'User Office',
            description: 'Max 4',
            businessId: user.businessId,
            userId: user.id,
            capacity: 4,
          },
        });
      } else if (user.role === 'MANAGER') {
        await db.room.create({
          data: {
            name: 'Manager Office',
            description: 'Max 6',
            businessId: user.businessId!,
            userId: user.id,
            capacity: 6,
          },
        });
      } else if (user.role === 'COMPANYADMIN') {
        await db.room.create({
          data: {
            name: 'Admin Office',
            description: 'Max 8',
            businessId: user.businessId!,
            userId: user.id,
            capacity: 8,
          },
        });
      } else if (user.role === 'OWNER') {
        await db.room.create({
          data: {
            name: 'Owner Office',
            description: 'Max 10',
            businessId: user.businessId!,
            userId: user.id,
            capacity: 10,
          },
        });
      }
    }

    if (offices === 'Office_Park') {
      officePark.map(
        async (room) =>
          await db.room.create({
            data: {
              name: room.name,
              description: room.description,
              businessId: business.id,
              capacity: room.capacity,
            },
          })
      );
    }

    if (offices === 'Downtown_Office') {
      downtownOffice.map(
        async (room) =>
          await db.room.create({
            data: {
              name: room.name,
              description: room.description,
              businessId: business.id,
              capacity: room.capacity,
            },
          })
      );
    }

    if (offices === 'Skyline') {
      skyline.map(
        async (room) =>
          await db.room.create({
            data: {
              name: room.name,
              description: room.description,
              businessId: business.id,
              capacity: room.capacity,
            },
          })
      );
    }
  };

  const superAdmins = await db.user.findMany({
    where: {
      role: 'SUPERADMIN',
    },
  });

  for (const superAdmin of superAdmins) {
    await db.room.create({
      data: {
        name: 'SuperAdmin Office',
        description: 'Max 10',
        userId: superAdmin.id,
        capacity: 10,
      },
    });
  }

  createRoomsList(business1, 'Office_Park', business1Users);
  createRoomsList(business2, 'Downtown_Office', business2Users);
  createRoomsList(business3, 'Skyline', business3Users);
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
