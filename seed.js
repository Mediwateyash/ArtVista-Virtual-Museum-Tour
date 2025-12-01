require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Museum, Section, Artifact } = require('./models');

mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Museum.deleteMany({});
        await Section.deleteMany({});
        await Artifact.deleteMany({});

        console.log('Cleared existing data...');

        // Create Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            name: 'Admin User',
            mobile: '9876543210',
            email: 'admin@artvista.com',
            password: hashedPassword,
            isAdmin: true
        });
        console.log('Admin user created');

        // Create Normal User
        const user = await User.create({
            name: 'John Doe',
            mobile: '9876543211',
            email: 'john@example.com',
            password: hashedPassword,
            isAdmin: false
        });
        console.log('Normal user created');

        // Create Museums
        const louvre = await Museum.create({
            name: 'The Louvre Museum',
            location: 'Paris, France',
            description: 'The Louvre is the world\'s largest art museum and a historic monument in Paris, France.',
            timings: '9:00 AM - 6:00 PM',
            imageUrl: 'https://images.unsplash.com/photo-1565060169194-196e927284b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        });

        const met = await Museum.create({
            name: 'The Metropolitan Museum of Art',
            location: 'New York, USA',
            description: 'The Met presents over 5,000 years of art from around the world for everyone to experience and enjoy.',
            timings: '10:00 AM - 5:00 PM',
            imageUrl: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        });

        // Create Sections for Louvre
        const paintings = await Section.create({ name: 'Paintings', museumId: louvre._id });
        const sculptures = await Section.create({ name: 'Sculptures', museumId: louvre._id });

        // Create Artifacts for Louvre
        await Artifact.create([
            {
                name: 'Mona Lisa',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
                description: 'The Mona Lisa is a half-length portrait painting by the Italian artist Leonardo da Vinci.',
                period: 'Renaissance',
                sectionId: paintings._id,
                museumId: louvre._id
            },
            {
                name: 'The Wedding Feast at Cana',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Paolo_Veronese_008.jpg/1280px-Paolo_Veronese_008.jpg',
                description: 'The Wedding Feast at Cana is a painting by the Italian Mannerist painter Paolo Veronese.',
                period: 'Renaissance',
                sectionId: paintings._id,
                museumId: louvre._id
            },
            {
                name: 'Venus de Milo',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Venus_de_Milo_Louvre_Ma399_n2.jpg/800px-Venus_de_Milo_Louvre_Ma399_n2.jpg',
                description: 'The Venus de Milo is an ancient Greek sculpture from the Hellenistic period.',
                period: 'Hellenistic',
                sectionId: sculptures._id,
                museumId: louvre._id
            }
        ]);

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
