import { PrismaClient, EmploymentStatus, LeaveType, LeaveStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.activityLog.deleteMany()
  await prisma.leaveRequest.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.department.deleteMany()

  // 1. Create Departments
  const engineering = await prisma.department.create({
    data: { name: 'Engineering', description: 'Software, infrastructure, and product design.' },
  })
  const hr = await prisma.department.create({
    data: { name: 'Human Resources', description: 'Talent acquisition, culture, and employee welfare.' },
  })
  const sales = await prisma.department.create({
    data: { name: 'Sales & Marketing', description: 'Revenue generation and market expansion.' },
  })

  // 2. Create Managers
  const manager1 = await prisma.employee.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'sarah.j@plasera.com',
      phone: '+1 555-0192',
      jobTitle: 'Head of Engineering',
      status: EmploymentStatus.FULL_TIME,
      departmentId: engineering.id,
      location: 'Kigali, Rwanda',
      dateJoined: new Date('2023-01-15'),
    },
  })

  const manager2 = await prisma.employee.create({
    data: {
      firstName: 'David',
      lastName: 'Okorie',
      email: 'david.o@plasera.com',
      phone: '+1 555-0144',
      jobTitle: 'HR Director',
      status: EmploymentStatus.FULL_TIME,
      departmentId: hr.id,
      location: 'Nairobi, Kenya',
      dateJoined: new Date('2023-03-01'),
    },
  })

  // 3. Create Employees
  const dev1 = await prisma.employee.create({
    data: {
      firstName: 'Placide',
      lastName: 'Shema',
      email: 'placide.s@plasera.com',
      phone: '+250 788 000 111',
      jobTitle: 'Full-Stack Developer Intern',
      status: EmploymentStatus.INTERN,
      departmentId: engineering.id,
      managerId: manager1.id,
      location: 'Kigali, Rwanda',
      dateJoined: new Date('2026-08-01'),
    },
  })

  const dev2 = await prisma.employee.create({
    data: {
      firstName: 'Amina',
      lastName: 'Musa',
      email: 'amina.m@plasera.com',
      phone: '+254 711 222 333',
      jobTitle: 'Frontend Engineer',
      status: EmploymentStatus.FULL_TIME,
      departmentId: engineering.id,
      managerId: manager1.id,
      location: 'Nairobi, Kenya',
      dateJoined: new Date('2024-06-10'),
    },
  })

  // 4. Create Leave Requests
  await prisma.leaveRequest.createMany({
    data: [
      {
        employeeId: dev1.id,
        type: LeaveType.ANNUAL,
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-05'),
        reason: 'Personal vacation',
        status: LeaveStatus.PENDING,
      },
      {
        employeeId: dev2.id,
        type: LeaveType.SICK,
        startDate: new Date('2026-08-10'),
        endDate: new Date('2026-08-12'),
        reason: 'Flu recovery',
        status: LeaveStatus.APPROVED,
      },
    ],
  })

  // 5. Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        employeeId: dev1.id,
        action: 'EMPLOYEE_JOINED',
        description: 'Placide Shema joined as Full-Stack Developer Intern.',
      },
      {
        employeeId: dev2.id,
        action: 'LEAVE_APPROVED',
        description: 'Approved sick leave request for Amina Musa.',
      },
    ],
  })

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })