require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('./models');

const createAdmin = async () => {
    const args = process.argv.slice(2);

    if (args.length < 4) {
        console.log('Usage: node create_admin.js <name> <email> <password> <mobile>');
        process.exit(1);
    }

    const [name, email, password, mobile] = args;

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User with this email already exists.');
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            isAdmin: true
        });

        console.log(`Admin user '${name}' created successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
