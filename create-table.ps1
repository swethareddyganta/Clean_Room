# PowerShell script to create password_reset_tokens table
# This script will call your application's API to create the table

Write-Host "Creating password_reset_tokens table..." -ForegroundColor Yellow

# Call the API endpoint to create the table
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/database/create-password-reset-table" -Method POST -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "Table created successfully!" -ForegroundColor Green
        Write-Host "Message: $($response.message)" -ForegroundColor Cyan
        
        if ($response.tableExists) {
            Write-Host "Table verification: password_reset_tokens table exists" -ForegroundColor Green
        }
    } else {
        Write-Host "Failed to create table: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "Error calling API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure your development server is running on port 3002" -ForegroundColor Yellow
}
