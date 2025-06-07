#!/bin/bash
echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Installing client dependencies..."
cd client
npm install
cd ..

echo "Setup complete! To start the application:"
echo "1. In one terminal: cd server && npm run dev"
echo "2. In another terminal: cd client && npm run dev"
