// Check for required environment variables
if (!process.env.VITE_BACKEND_URL) {
  console.error('Error: VITE_BACKEND_URL environment variable is required');
  process.exit(1);
}

// Log the environment variables being used
console.log('Building with environment variables:');
console.log(`VITE_BACKEND_URL: ${process.env.VITE_BACKEND_URL}`);

// Continue with the build
console.log('Starting build process...');
