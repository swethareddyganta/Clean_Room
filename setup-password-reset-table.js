const mysql = require('mysql2/promise');
const fs = require('fs');

async function createPasswordResetTable() {
  let connection;
  
  try {
    console.log('🔗 Connecting to remote database...');
    
    // Create connection to remote database
    connection = await mysql.createConnection({
      host: '103.86.177.38',
      user: 'atsuser',
      password: 'Root1234!',
      database: 'cleanroom_db',
      port: 3306,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('✅ Connected to remote database successfully');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('create-password-reset-table.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('🔄 Executing:', statement.substring(0, 50) + '...');
        await connection.execute(statement);
      }
    }
    
    console.log('✅ Password reset tokens table created successfully!');
    
    // Verify the table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'password_reset_tokens'");
    if (tables.length > 0) {
      console.log('✅ Table verification: password_reset_tokens table exists');
      
      // Show table structure
      const [structure] = await connection.execute("DESCRIBE password_reset_tokens");
      console.log('📋 Table structure:');
      console.table(structure);
    } else {
      console.log('❌ Table verification failed: password_reset_tokens table not found');
    }
    
  } catch (error) {
    console.error('❌ Error creating password reset table:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
createPasswordResetTable()
  .then(() => {
    console.log('🎉 Password reset table setup completed successfully!');
    console.log('💡 You can now test the password reset functionality.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });

