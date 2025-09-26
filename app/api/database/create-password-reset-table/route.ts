import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Creating password_reset_tokens table...');
    
    // Create the password_reset_tokens table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
      )
    `;
    
    const createResult = await executeQuery(createTableSQL, []);
    
    if (createResult.error) {
      console.error('❌ Error creating table:', createResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to create table', error: createResult.error },
        { status: 500 }
      );
    }
    
    console.log('✅ Table creation query executed');
    
    // Create indexes
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token)',
      'CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at)'
    ];
    
    for (const indexSQL of indexQueries) {
      try {
        await executeQuery(indexSQL, []);
        console.log('✅ Index created:', indexSQL.substring(0, 50) + '...');
      } catch (error) {
        console.warn('⚠️ Index creation warning:', error);
        // Continue even if index creation fails
      }
    }
    
    // Verify the table exists
    const verifySQL = "SHOW TABLES LIKE 'password_reset_tokens'";
    const verifyResult = await executeQuery(verifySQL, []);
    
    if (verifyResult.error) {
      console.error('❌ Error verifying table:', verifyResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to verify table creation' },
        { status: 500 }
      );
    }
    
    const tables = verifyResult.data as any[];
    if (tables && tables.length > 0) {
      console.log('✅ Password reset tokens table created successfully!');
      
      // Get table structure
      const structureSQL = "DESCRIBE password_reset_tokens";
      const structureResult = await executeQuery(structureSQL, []);
      
      return NextResponse.json({
        success: true,
        message: 'Password reset tokens table created successfully!',
        tableExists: true,
        structure: structureResult.data
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Table was not created' },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('❌ Error in create table API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

