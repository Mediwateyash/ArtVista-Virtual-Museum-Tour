const bcrypt = require('bcrypt');
const { User } = require('../models');

const register = async (req, res) => {
    try {
        const { name, mobile, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.render('user/register', { error: 'Passwords do not match' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('user/register', { error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, mobile, email, password: hashedPassword });
        await newUser.save();
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        res.render('user/register', { error: 'Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('user/login', { error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('user/login', { error: 'Invalid credentials' });
        }
        req.session.user = user;
        if (user.isAdmin) {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.render('user/login', { error: 'Server Error' });
    }
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

const setupAdmins = async (req, res) => {
    try {
        const admins = [
            { name: 'Yash', email: 'yash@artvista.com', password: 'adminyash', mobile: '9876543211' },
            { name: 'Anush', email: 'anush@artvista.com', password: 'adminanush', mobile: '9876543212' },
            { name: 'Prince', email: 'prince@artvista.com', password: 'adminprince', mobile: '9876543213' }
        ];

        let createdCount = 0;

        for (const admin of admins) {
            const existingUser = await User.findOne({ email: admin.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(admin.password, 10);
                await User.create({
                    name: admin.name,
                    email: admin.email,
                    password: hashedPassword,
                    mobile: admin.mobile,
                    isAdmin: true
                });
                createdCount++;
            }
        }

        res.send(`Setup complete! Created ${createdCount} new admins. You can now login.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error setting up admins: ' + error.message);
    }
};

module.exports = { register, login, logout, setupAdmins };
