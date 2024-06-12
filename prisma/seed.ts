const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // user account
    await prisma.user.upsert({
        where: {email: 'test@email.com'},
        update: {},
        create: {
            "email": "test@email.com",
            "firstName": "Test",
            "lastName": "User",
            "password": "$2b$10$roUaSg9pF8Zqy10IZ6LuZOkBx8gjcwm5r//j/1jesJAuy4MW1aEZK",
            "role": "USER"
        },
    });

    // admin account
    await prisma.user.upsert({
        where: {email: 'admin@email.com'},
        update: {},
        create: {
            "email": "admin@email.com",
            "firstName": "Test",
            "lastName": "Student",
            "password": "$2b$10$roUaSg9pF8Zqy10IZ6LuZOkBx8gjcwm5r//j/1jesJAuy4MW1aEZK",
            "role": "ADMIN"
        },
    });

    // department records
    const department = await prisma.department.upsert({
        where: {name: 'Computer Science and Mathematics'},
        update: {},
        create: {
            "name": "Computer Science and Mathematics",
            "description": "the mathematical sciences department"
        },
    });

    // course records
    const course1 = await prisma.course.upsert({
        where: {name: 'Computer Science'},
        update: {},
        create: {
            "name": "Computer Science",
            "description": "Our Computer Science course is the most flexible of our courses in computing, allowing you to choose from a wide choice of optional modules and to specialise in areas as diverse as assistive technologies, computer games, artificial intelligence, evolutionary computation, Big Data and robotics. If you have a good ability to think in a computational way, you'll be perfect for our course.",
            "departmentId": department.id,
            "maxUnit": 10
        },
    });

    const course2 = await prisma.course.upsert({
        where: {name: 'Software Engineer'},
        update: {},
        create: {
            "name": "Software Engineer",
            "description": "Computer systems can be found everywhere: inside a mobile phone, at a hospital bedside, and inside your TV, washing machine and games consoles. Computer systems engineers explore how this works – what is needed to convert machines and machinery into useful computing. We're for people who want to figure out what goes on inside the box.",
            "departmentId": department.id,
            "maxUnit": 10
        },
    });

    const course3 = await prisma.course.upsert({
        where: {name: 'Cyber Security'},
        update: {},
        create: {
            "name": "Cyber Security",
            "description": "On this course, you’ll learn about key security concepts, as well as traditional and contemporary Software Development Life Cycle models. You’ll also undertake an inter-disciplinary perspective involving psychology that considers the human factor in cyber security challenges. What’s more, all our degrees have a strong focus on career progression, so you’ll also develop professional practice and research skills.",
            "departmentId": department.id,
            "maxUnit": 10
        },
    });

    // staff records
    const staff1 = await prisma.staff.upsert({
        where: {id: '6709c9f3-e891-4aa1-8721-6670d1b847a3'},
        update: {},
        create: {
            "id": "6709c9f3-e891-4aa1-8721-6670d1b847a3",
            "firstName": "John",
            "lastName": "Doe",
            "title": "Senior Lecturer",
            "departmentId": department.id
        },
    });

    const staff2 = await prisma.staff.upsert({
        where: {id: '6709c9f3-e891-4aa1-8721-6670d1b847a5'},
        update: {},
        create: {
            "id": "6709c9f3-e891-4aa1-8721-6670d1b847a5",
            "firstName": "Jane",
            "lastName": "Doris",
            "title": "Associate Professor",
            "departmentId": department.id
        },
    });

    // module records
    const modules = [
        {
            "code": "COS1903",
            "title": "Scala Programming",
            "description": "This course is designed to provide students with a comprehensive understanding of the language, its features, and the ability to write high-performance, maintainable code. The course covers the structure of the language, the behavior of function calls, type safety, and the principles of functional programming.",
            "content": "",
            "courseId": course1.id,
            "unit": 2
        },
        {
            "code": "COS1920",
            "title": "Database Management",
            "description": "This course is designed to provide students with a comprehensive understanding of the database management.",
            "content": "",
            "courseId": course1.id,
            "unit": 2
        },
        {
            "code": "COS2905",
            "title": "Object Oriented Programming (Java)",
            "description": "This course is designed to provide students with a comprehensive understanding of the object oriented programming (OOP).",
            "content": "",
            "courseId": course1.id,
            "unit": 2
        },
        {
            "code": "COS2910",
            "title": "Database Management II",
            "description": "This course is designed to provide students with a more advanced and comprehensive understanding of database management.",
            "content": "",
            "courseId": course1.id,
            "unit": 2
        },
        {
            "code": "SE3906",
            "title": "Interaction Design",
            "description": "This course is designed to provide students with a comprehensive understanding of interaction design.",
            "content": "",
            "courseId": course2.id,
            "unit": 2
        },
        {
            "code": "SE3902",
            "title": "Computer Law and Cybersecurity Management",
            "description": "This course is designed to provide students with a comprehensive understanding of computer law and cybersecurity management.",
            "content": "",
            "courseId": course3.id,
            "unit": 2
        },
        {
            "code": "SE3410",
            "title": "Web Application Penetration Testing",
            "description": "This course is designed to provide students with a comprehensive understanding of web application penetration testing.",
            "content": "",
            "courseId": course2.id,
            "unit": 2
        },
        {
            "code": "SE3406",
            "title": "Fuzzy Logic and Knowledge Based Systems",
            "description": "This course is designed to provide students with a comprehensive understanding of fuzzy logic and knowledge based systems.",
            "content": "",
            "courseId": course2.id,
            "unit": 2
        },
        {
            "code": "SE3613",
            "title": "Data Mining",
            "description": "This course is designed to provide students with a comprehensive understanding of data mining.",
            "content": "",
            "courseId": course2.id,
            "unit": 2
        },
        {
            "code": "SE3901",
            "title": "C Programming",
            "description": "This course is designed to provide students with a comprehensive understanding of programming in C.",
            "content": "",
            "courseId": course3.id,
            "unit": 2
        },
        {
            "code": "SE3903",
            "title": "Linux Security",
            "description": "This course is designed to provide students with a comprehensive understanding of linux security.",
            "content": "",
            "courseId": course3.id,
            "unit": 2
        },
        {
            "code": "SE3904",
            "title": "Cyber Threat Intelligence and Incident Response",
            "description": "This course is designed to provide students with a comprehensive understanding of cyber threat intelligence and incident response.",
            "content": "",
            "courseId": course3.id,
            "unit": 2
        },
    ];

    for (const module of modules) {
        const newModule = await prisma.module.upsert({
            where: {code: module.code},
            update: {},
            create: {
                "code": module.code,
                "title": module.title,
                "description": module.description,
                "content": module.content,
                "courseId": module.courseId,
                "unit": module.unit
            },
        });

        await prisma.moduleStaff.upsert({
            where: {
                moduleId_staffId: {
                    moduleId: newModule.id,
                    staffId: staff1.id,
                },
            },
            update: {},
            create: {
                moduleId: newModule.id,
                staffId: staff1.id
            },
        });

        await prisma.moduleStaff.upsert({
            where: {
                moduleId_staffId: {
                    moduleId: newModule.id,
                    staffId: staff2.id,
                },
            },
            update: {},
            create: {
                moduleId: newModule.id,
                staffId: staff2.id
            },
        });
    }
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
