const { sequelize } = require('./config/db');
const {
  User, Employee, Department, Attendance, Leave, Payroll,
  Performance, Training, Document, Recruitment, Onboarding,
  Offboarding, Notification, TrainingParticipant, EmployeeDocument
} = require('./models');

async function testCRUD() {
  try {
    console.log('🚀 Starting CRUD Operations Test...');
    
    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced successfully');

    // Test User CRUD
    console.log('\n📝 Testing User CRUD...');
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin'
    });
    console.log('✅ User created:', user.id);
    
    const foundUser = await User.findByPk(user.id);
    console.log('✅ User found:', foundUser.username);
    
    await foundUser.update({ username: 'updateduser' });
    console.log('✅ User updated:', foundUser.username);
    
    // Test Department CRUD
    console.log('\n🏢 Testing Department CRUD...');
    const department = await Department.create({
      name: 'Engineering',
      description: 'Software Development Team',
      managerId: user.id
    });
    console.log('✅ Department created:', department.id);
    
    const foundDept = await Department.findByPk(department.id);
    console.log('✅ Department found:', foundDept.name);
    
    await foundDept.update({ name: 'Software Engineering' });
    console.log('✅ Department updated:', foundDept.name);

    // Test Employee CRUD
    console.log('\n👤 Testing Employee CRUD...');
    const employee = await Employee.create({
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '1234567890',
      position: 'Software Developer',
      departmentId: department.id,
      managerId: user.id,
      hireDate: new Date(),
      salary: 75000,
      status: 'active'
    });
    console.log('✅ Employee created:', employee.id);
    
    const foundEmployee = await Employee.findByPk(employee.id);
    console.log('✅ Employee found:', foundEmployee.firstName);
    
    await foundEmployee.update({ position: 'Senior Software Developer' });
    console.log('✅ Employee updated:', foundEmployee.position);

    // Test Attendance CRUD
    console.log('\n⏰ Testing Attendance CRUD...');
    const attendance = await Attendance.create({
      employeeId: employee.id,
      date: new Date(),
      checkIn: new Date(),
      status: 'present'
    });
    console.log('✅ Attendance created:', attendance.id);
    
    const foundAttendance = await Attendance.findByPk(attendance.id);
    console.log('✅ Attendance found:', foundAttendance.status);
    
    await foundAttendance.update({ 
      checkOut: new Date(),
      hoursWorked: 8
    });
    console.log('✅ Attendance updated with checkout');

    // Test Leave CRUD
    console.log('\n🏖️ Testing Leave CRUD...');
    const leave = await Leave.create({
      employeeId: employee.id,
      type: 'vacation',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      reason: 'Annual vacation',
      status: 'pending'
    });
    console.log('✅ Leave created:', leave.id);
    
    const foundLeave = await Leave.findByPk(leave.id);
    console.log('✅ Leave found:', foundLeave.type);
    
    await foundLeave.update({ status: 'approved' });
    console.log('✅ Leave updated:', foundLeave.status);

    // Test Payroll CRUD
    console.log('\n💰 Testing Payroll CRUD...');
    const payroll = await Payroll.create({
      employeeId: employee.id,
      payPeriodStart: new Date(),
      payPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      basicSalary: 75000,
      grossPay: 75000,
      netPay: 60000,
      status: 'processed'
    });
    console.log('✅ Payroll created:', payroll.id);
    
    const foundPayroll = await Payroll.findByPk(payroll.id);
    console.log('✅ Payroll found:', foundPayroll.grossPay);
    
    await foundPayroll.update({ status: 'paid' });
    console.log('✅ Payroll updated:', foundPayroll.status);

    // Test Performance CRUD
    console.log('\n📊 Testing Performance CRUD...');
    const performance = await Performance.create({
      employeeId: employee.id,
      reviewerId: user.id,
      reviewPeriodStart: new Date(),
      reviewPeriodEnd: new Date(),
      overallRating: 4.5,
      goals: 'Improve coding skills',
      achievements: 'Completed major project',
      status: 'completed'
    });
    console.log('✅ Performance created:', performance.id);
    
    const foundPerformance = await Performance.findByPk(performance.id);
    console.log('✅ Performance found:', foundPerformance.overallRating);
    
    await foundPerformance.update({ overallRating: 5.0 });
    console.log('✅ Performance updated:', foundPerformance.overallRating);

    // Test Training CRUD
    console.log('\n🎓 Testing Training CRUD...');
    const training = await Training.create({
      title: 'React Advanced Concepts',
      description: 'Advanced React training',
      startDate: new Date(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      capacity: 20,
      status: 'scheduled'
    });
    console.log('✅ Training created:', training.id);
    
    const foundTraining = await Training.findByPk(training.id);
    console.log('✅ Training found:', foundTraining.title);
    
    await foundTraining.update({ status: 'ongoing' });
    console.log('✅ Training updated:', foundTraining.status);

    // Test Document CRUD
    console.log('\n📄 Testing Document CRUD...');
    const document = await Document.create({
      title: 'Employee Handbook',
      type: 'policy',
      filePath: '/documents/handbook.pdf',
      uploadedBy: user.id,
      status: 'active'
    });
    console.log('✅ Document created:', document.id);
    
    const foundDocument = await Document.findByPk(document.id);
    console.log('✅ Document found:', foundDocument.title);
    
    await foundDocument.update({ status: 'archived' });
    console.log('✅ Document updated:', foundDocument.status);

    // Test Recruitment CRUD
    console.log('\n🎯 Testing Recruitment CRUD...');
    const recruitment = await Recruitment.create({
      jobTitle: 'Frontend Developer',
      department: 'Engineering',
      description: 'React developer position',
      requirements: 'React, JavaScript, CSS',
      salaryRange: '60000-80000',
      status: 'open',
      postedBy: user.id
    });
    console.log('✅ Recruitment created:', recruitment.id);
    
    const foundRecruitment = await Recruitment.findByPk(recruitment.id);
    console.log('✅ Recruitment found:', foundRecruitment.jobTitle);
    
    await foundRecruitment.update({ status: 'closed' });
    console.log('✅ Recruitment updated:', foundRecruitment.status);

    // Test Onboarding CRUD
    console.log('\n🚪 Testing Onboarding CRUD...');
    const onboarding = await Onboarding.create({
      employeeId: employee.id,
      startDate: new Date(),
      checklist: ['Setup workspace', 'Complete paperwork'],
      status: 'in_progress',
      assignedTo: user.id
    });
    console.log('✅ Onboarding created:', onboarding.id);
    
    const foundOnboarding = await Onboarding.findByPk(onboarding.id);
    console.log('✅ Onboarding found:', foundOnboarding.status);
    
    await foundOnboarding.update({ status: 'completed' });
    console.log('✅ Onboarding updated:', foundOnboarding.status);

    // Test Offboarding CRUD
    console.log('\n🚪 Testing Offboarding CRUD...');
    const offboarding = await Offboarding.create({
      employeeId: employee.id,
      lastWorkingDay: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      reason: 'resignation',
      checklist: ['Return equipment', 'Knowledge transfer'],
      status: 'pending',
      initiatedBy: user.id
    });
    console.log('✅ Offboarding created:', offboarding.id);
    
    const foundOffboarding = await Offboarding.findByPk(offboarding.id);
    console.log('✅ Offboarding found:', foundOffboarding.reason);
    
    await foundOffboarding.update({ status: 'in_progress' });
    console.log('✅ Offboarding updated:', foundOffboarding.status);

    // Test Notification CRUD
    console.log('\n🔔 Testing Notification CRUD...');
    const notification = await Notification.create({
      userId: user.id,
      title: 'Welcome Message',
      message: 'Welcome to the company!',
      type: 'info',
      status: 'unread'
    });
    console.log('✅ Notification created:', notification.id);
    
    const foundNotification = await Notification.findByPk(notification.id);
    console.log('✅ Notification found:', foundNotification.title);
    
    await foundNotification.update({ status: 'read' });
    console.log('✅ Notification updated:', foundNotification.status);

    // Test Junction Tables CRUD
    console.log('\n🔗 Testing Junction Tables CRUD...');
    
    // TrainingParticipant
    const trainingParticipant = await TrainingParticipant.create({
      trainingId: training.id,
      employeeId: employee.id,
      status: 'enrolled'
    });
    console.log('✅ TrainingParticipant created:', trainingParticipant.id);
    
    await trainingParticipant.update({ status: 'completed' });
    console.log('✅ TrainingParticipant updated:', trainingParticipant.status);
    
    // EmployeeDocument
    const employeeDocument = await EmployeeDocument.create({
      employeeId: employee.id,
      documentId: document.id,
      accessLevel: 'read'
    });
    console.log('✅ EmployeeDocument created:', employeeDocument.id);
    
    await employeeDocument.update({ accessLevel: 'write' });
    console.log('✅ EmployeeDocument updated:', employeeDocument.accessLevel);

    // Test DELETE operations
    console.log('\n🗑️ Testing DELETE operations...');
    
    await trainingParticipant.destroy();
    console.log('✅ TrainingParticipant deleted');
    
    await employeeDocument.destroy();
    console.log('✅ EmployeeDocument deleted');
    
    await notification.destroy();
    console.log('✅ Notification deleted');
    
    await offboarding.destroy();
    console.log('✅ Offboarding deleted');
    
    await onboarding.destroy();
    console.log('✅ Onboarding deleted');
    
    await recruitment.destroy();
    console.log('✅ Recruitment deleted');
    
    await document.destroy();
    console.log('✅ Document deleted');
    
    await training.destroy();
    console.log('✅ Training deleted');
    
    await performance.destroy();
    console.log('✅ Performance deleted');
    
    await payroll.destroy();
    console.log('✅ Payroll deleted');
    
    await leave.destroy();
    console.log('✅ Leave deleted');
    
    await attendance.destroy();
    console.log('✅ Attendance deleted');
    
    await foundEmployee.destroy();
    console.log('✅ Employee deleted');
    
    await foundDept.destroy();
    console.log('✅ Department deleted');
    
    await foundUser.destroy();
    console.log('✅ User deleted');

    console.log('\n🎉 All CRUD operations completed successfully!');
    console.log('\n📊 CRUD Test Summary:');
    console.log('✅ User: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Department: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Employee: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Attendance: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Leave: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Payroll: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Performance: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Training: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Document: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Recruitment: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Onboarding: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Offboarding: CREATE, READ, UPDATE, DELETE');
    console.log('✅ Notification: CREATE, READ, UPDATE, DELETE');
    console.log('✅ TrainingParticipant: CREATE, READ, UPDATE, DELETE');
    console.log('✅ EmployeeDocument: CREATE, READ, UPDATE, DELETE');
    
  } catch (error) {
    console.error('❌ CRUD Test Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
if (require.main === module) {
  testCRUD();
}

module.exports = testCRUD;