const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: __dirname + '/.env' });

// Load models
const Restaurant = require('./src/models/Restaurant');
const User = require('./src/models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    // 1. Create a dummy owner for these restaurants
    let owner = await User.findOne({ email: 'owner_akurdi@foodhub.com' });
    if (!owner) {
      owner = await User.create({
        name: 'Akurdi Master Owner',
        email: 'owner_akurdi@foodhub.com',
        password: 'password123',
        role: 'owner',
        phone: '9999999999'
      });
    }

    // 2. Delete ALL previous restaurants owned by this master owner to prevent duplicates
    await Restaurant.deleteMany({ owner: owner._id });

    // 3. Read CSV
    const csvFilePath = path.join(__dirname, '../foodhub_pro_100_akurdi_restaurants.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');
    
    // Parse CSV manually
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    
    const restaurantsToInsert = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i];
      const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
      const values = currentLine.split(regex);
      
      if (values.length >= 4) {
        const name = values[0].trim().replace(/"/g, '');
        const category = values[1].trim().replace(/"/g, '');
        const cuisines = values[2].replace(/"/g, '').split(',').map(c => c.trim());
        const address = values[3].replace(/"/g, '').trim();
        
        restaurantsToInsert.push({
          name: name,
          description: `Famous ${category} restaurant located in Akurdi.`,
          address: address,
          cuisines: cuisines,
          owner: owner._id,
          isApproved: true,
          isActive: true,
          image: 'no-photo.jpg'
        });
      }
    }

    // Insert into DB
    await Restaurant.insertMany(restaurantsToInsert);
    
    console.log('Akurdi Restaurant Data Imported Successfully! 🟢');
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Restaurant.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed... 🔴');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
