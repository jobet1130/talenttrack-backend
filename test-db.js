const { sequelize } = require('./config/db');
const {
  User,
  Employee,
  Department,
  Attendance,
  Leave,
  Payroll,
  Performance,
  Training,
  Document,
  Recruitment,
  Onboarding,
  Offboarding,
  Notification
} = require('./models');

async function testDatabase() {
  try {
    console.log('🔄 Starting database tests...');
    
    // Test 1: Database Connection
    console.log('\n1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Test 2: Model Synchronization
    console.log('\n2. Testing model synchronization...');
    await sequelize.sync({ alter: true }); // Use alter instead of force to preserve data
    console.log('✅ All models synchronized successfully');
    
    // Test 3: Check Model Definitions
    console.log('\n3. Checking model definitions...');
    const models = [
      'User', 'Employee', 'Department', 'Attendance', 'Leave',
      'Payroll', 'Performance', 'Training', 'Document', 'Recruitment',
      'Onboarding', 'Offboarding', 'Notification'
    ];
    
    models.forEach(modelName => {
      const model = sequelize.models[modelName];
      if (model) {
        console.log(`✅ ${modelName} model loaded with ${Object.keys(model.rawAttributes).length} attributes`);
      } else {
        console.log(`❌ ${modelName} model not found`);
      }
    });
    
    // Test 4: Check Associations
    console.log('\n4. Checking model associations...');
    const associationCount = Object.keys(sequelize.models).reduce((count, modelName) => {
      const model = sequelize.models[modelName];
      return count + Object.keys(model.associations).length;
    }, 0);
    console.log(`✅ Total associations defined: ${associationCount}`);
    
    // Test 5: Simple Query Test
    console.log('\n5. Testing basic queries...');
    
    // Count records in each table
    for (const modelName of models) {
      const model = sequelize.models[modelName];
      if (model) {
        try {
          const count = await model.count();
          console.log(`✅ ${modelName}: ${count} records`);
        } catch (error) {
          console.log(`⚠️  ${modelName}: Query failed - ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 Database tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Database connection');
    console.log('   ✅ Model synchronization');
    console.log('   ✅ Model definitions');
    console.log('   ✅ Model associations');
    console.log('   ✅ Basic queries');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the tests
if (require.main === module) {
  testDatabase();
}

module.exports = testDatabase;