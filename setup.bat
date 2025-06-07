@echo off
echo Installing server dependencies...
cd server
call npm install
cd ..

echo Installing client dependencies...
cd client
call npm install
cd ..

echo Setup complete! To start the application:
echo 1. In one terminal: cd server && npm run dev
echo 2. In another terminal: cd client && npm run dev
