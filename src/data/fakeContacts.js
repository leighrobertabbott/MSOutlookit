// Fake contact data generator for Address Book
// Approximately 200 contacts with realistic corporate details

const firstNames = [
    'Emma', 'Oliver', 'Amelia', 'Harry', 'Isla', 'Jack', 'Ava', 'George', 'Mia', 'Noah',
    'Sophie', 'Leo', 'Lily', 'Oscar', 'Grace', 'Charlie', 'Chloe', 'Jacob', 'Ella', 'Alfie',
    'Emily', 'Freddie', 'Poppy', 'Henry', 'Sophia', 'William', 'Evie', 'Thomas', 'Isabelle', 'James',
    'Daisy', 'Edward', 'Freya', 'Alexander', 'Ruby', 'Sebastian', 'Florence', 'Daniel', 'Alice', 'Joseph',
    'Matilda', 'Samuel', 'Sienna', 'David', 'Charlotte', 'Benjamin', 'Rosie', 'Ethan', 'Millie', 'Matthew',
    'Phoebe', 'Lucas', 'Eva', 'Archie', 'Ivy', 'Joshua', 'Willow', 'Arthur', 'Elsie', 'Theodore',
    'Sarah', 'John', 'Rachel', 'Michael', 'Hannah', 'Andrew', 'Laura', 'Robert', 'Jessica', 'Paul',
    'Rebecca', 'Mark', 'Louise', 'Steven', 'Victoria', 'Peter', 'Catherine', 'Richard', 'Jennifer', 'Christopher',
    'Maria', 'Mohammed', 'Fatima', 'Raj', 'Priya', 'Wei', 'Mei', 'Marcus', 'Chioma', 'Amir',
    'Samantha', 'Nathan', 'Caroline', 'Adam', 'Michelle', 'Ryan', 'Stephanie', 'Connor', 'Nicole', 'Luke'
];

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
    'Turner', 'Phillips', 'Evans', 'Parker', 'Edwards', 'Collins', 'Stewart', 'Morris', 'Morales', 'Murphy',
    'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Gomez', 'Kelly',
    'Howard', 'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray',
    'Foster', 'Patel', 'Singh', 'O\'Brien', 'McCarthy', 'Sullivan', 'Cunningham', 'Patterson', 'Murray', 'Farrell',
    'Walsh', 'Burke', 'Hayes', 'Dixon', 'Duffy', 'Brennan', 'Forbes', 'Quinn', 'Casey', 'Kennedy'
];

const titles = [
    'Software Engineer', 'Senior Developer', 'Lead Developer', 'Principal Engineer', 'Tech Lead',
    'Project Manager', 'Product Manager', 'Scrum Master', 'Business Analyst', 'Data Analyst',
    'UX Designer', 'UI Designer', 'Graphic Designer', 'Creative Director', 'Art Director',
    'Marketing Manager', 'Marketing Coordinator', 'Sales Representative', 'Account Executive', 'Sales Manager',
    'HR Specialist', 'HR Manager', 'Recruiter', 'Training Coordinator', 'Benefits Coordinator',
    'Financial Analyst', 'Accountant', 'Controller', 'Finance Manager', 'CFO',
    'Customer Service Rep', 'Support Specialist', 'Technical Support', 'Help Desk Analyst',
    'Operations Manager', 'Office Manager', 'Administrative Assistant', 'Executive Assistant',
    'Legal Counsel', 'Paralegal', 'Compliance Officer', 'Quality Assurance',
    'Research Scientist', 'Lab Technician', 'R&D Manager', 'Innovation Lead',
    'Consultant', 'Advisor', 'Specialist', 'Coordinator', 'Director', 'VP', 'Manager'
];

const departments = [
    'Engineering', 'Product Development', 'Research & Development', 'IT Services', 'DevOps',
    'Marketing', 'Sales', 'Business Development', 'Customer Success', 'Support',
    'Human Resources', 'Finance', 'Accounting', 'Legal', 'Compliance',
    'Operations', 'Facilities', 'Administration', 'Executive', 'Strategy',
    'Design', 'Creative', 'Content', 'Communications', 'Public Relations',
    'Quality Assurance', 'Training', 'Learning & Development', 'Procurement', 'Supply Chain',
    'Data Science', 'Analytics', 'Security', 'Infrastructure', 'Platform'
];

const offices = [
    'Headquarters', 'Main Office', 'Downtown Office', 'Tech Campus', 'Innovation Center',
    'Regional Office - North', 'Regional Office - South', 'Regional Office - East', 'Regional Office - West',
    'Building A', 'Building B', 'Building C', 'Tower 1', 'Tower 2',
    'Satellite Office', 'Remote Hub', 'Co-working Space', 'Client Site', 'Field Office',
    'Distribution Center', 'Warehouse', 'Lab Facility', 'Research Center', 'Training Center'
];

const companies = [
    'Contoso Corporation', 'Fabrikam Inc', 'Northwind Traders',
    'Adventure Works', 'Tailspin Toys', 'Wide World Importers',
    'Woodgrove Bank', 'Alpine Ski House', 'Proseware Inc'
];

function generateEmail(firstName, lastName, domain = 'contoso.com') {
    const formats = [
        `${firstName}.${lastName}@${domain}`,
        `${firstName.charAt(0)}.${lastName}@${domain}`,
        `${firstName}${lastName.charAt(0)}@${domain}`,
        `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`
    ];
    return formats[Math.floor(Math.random() * formats.length)].toLowerCase();
}

function generatePhone() {
    const prefix = ['(555)', '(212)', '(415)', '(310)', '(312)'];
    return `${prefix[Math.floor(Math.random() * prefix.length)]} ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function generateAlias(firstName, lastName) {
    const formats = [
        `${firstName}.${lastName}`,
        `${firstName}${lastName.charAt(0)}`,
        `${lastName}.${firstName}`,
        `${firstName[0]}${lastName}`
    ];
    return formats[Math.floor(Math.random() * formats.length)];
}

// Generate 200 contacts
export function generateContacts() {
    const contacts = [];
    const usedEmails = new Set();
    const domains = ['contoso.com', 'fabrikam.com', 'northwind.com', 'adventure-works.com'];

    for (let i = 0; i < 200; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const office = offices[Math.floor(Math.random() * offices.length)];
        const company = companies[Math.floor(Math.random() * companies.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];

        let email = generateEmail(firstName, lastName, domain);
        // Ensure unique emails
        let attempts = 0;
        while (usedEmails.has(email) && attempts < 10) {
            email = generateEmail(firstName, lastName, domain) + Math.floor(Math.random() * 100);
            attempts++;
        }
        usedEmails.add(email);

        contacts.push({
            id: `contact-${i}`,
            firstName,
            lastName,
            displayName: `${firstName} ${lastName}`,
            initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
            title,
            department,
            office,
            company,
            email,
            alias: generateAlias(firstName, lastName),
            phone: Math.random() > 0.3 ? generatePhone() : '',
            businessPhone: Math.random() > 0.5 ? generatePhone() : '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States',
            assistant: '',
            notes: ''
        });
    }

    // Sort by display name
    contacts.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // Add some special mailbox entries at the top
    const specialEntries = [
        { id: 'special-1', displayName: 'All Company', firstName: 'All', lastName: 'Company', email: 'all@contoso.com', title: 'Distribution List', department: '', office: 'Headquarters', company: 'Contoso Corporation', alias: 'all.company' },
        { id: 'special-2', displayName: 'Help Desk', firstName: 'Help', lastName: 'Desk', email: 'helpdesk@contoso.com', title: 'Support Mailbox', department: 'IT Services', office: 'Headquarters', company: 'Contoso Corporation', alias: 'helpdesk' },
        { id: 'special-3', displayName: 'HR Inquiries', firstName: 'HR', lastName: 'Inquiries', email: 'hr@contoso.com', title: 'HR Mailbox', department: 'Human Resources', office: 'Headquarters', company: 'Contoso Corporation', alias: 'hr.inquiries' },
        { id: 'special-4', displayName: 'Sales Team', firstName: 'Sales', lastName: 'Team', email: 'sales@contoso.com', title: 'Distribution List', department: 'Sales', office: 'Headquarters', company: 'Contoso Corporation', alias: 'sales.team' },
    ];

    return [...specialEntries, ...contacts];
}

// Pre-generate contacts for export
export const fakeContacts = generateContacts();

export default fakeContacts;
