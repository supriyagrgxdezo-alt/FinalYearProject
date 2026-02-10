const User = require('../model/User');
const bcrypt = require('bcrypt');

  class DataInitializationService {
    async initializedAdminUser(){
        const adminEmail = 'grgsupriya121@gmail.com';
        const adminPassword = 'Supriya60$';

        try {
            const adminExists = await User.findOne({email: adminEmail});

            if (!adminExists){
                const hashedPassword = await bcrypt.hash(adminPassword, 10);

                const adminUser = new User({
                    fullName: 'GurungSup',
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ROLE_ADMIN',
                });

                await adminUser.save();
                console.log("Admin user created successfulyy!");

            }else{
                console.log("Admin user already exists.");
            }
        } catch (error) {
            console.log("Error during admin initialization", error);
        }

    }
  }

  module.exports = new DataInitializationService();

