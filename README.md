# Genieverse Travel

A travel platform for exploring and booking unique travel experiences, built with React (TypeScript) frontend and Python backend.

## Prerequisites

- Node.js 16.x or higher
- Python 3.8 or higher
- npm or yarn
- pip (Python package manager)

## Project Structure

```
genieverse-travel/
├── client/          # Frontend React application
│   ├── src/        # Source code
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   └── styles/     # CSS styles
│   ├── public/    # Static assets
│   └── package.json
├── server/         # Backend server code
│   ├── .env       # Environment variables (provided by maintainers)
│   └── app.py     # Main server application
├── data/          # Data files (provided by maintainers)
└── README.md      # Project documentation
```

## Setup and Installation

### Client (Frontend)

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The client will run on `http://localhost:5173` by default.

### Server (Backend)

1. Navigate to the server directory:
```bash
cd server
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Environment Setup:
   - The `.env` file and `data` folder will be provided by the project maintainers
   - Place the `.env` file in the `server` directory
   - Place the `data` folder in the project root

4. Start the development server:
```bash
python app.py
```

The server will run on `http://localhost:5000` by default.

## Development

### Client
- Built with React + TypeScript
- Uses Tailwind CSS for styling
- Components are located in `client/src/components`
- Pages are located in `client/src/pages`

### Server
- Built with Python
- RESTful API endpoints
- Database configuration in `.env` file
