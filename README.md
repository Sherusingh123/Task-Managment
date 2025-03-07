# Real-time Chat and Issue Tracking System

A real-time chat application with issue tracking functionality built using React, Socket.IO, and Express.

## Features

- Real-time messaging between users and admins
- Message read receipts and delivery status
- Issue reporting and tracking system
- Admin dashboard with issue management
- Real-time notifications
- Message history and conversation tracking
- Issue filtering and sorting

## Technologies Used

- React
- Socket.IO
- Express
- Tailwind CSS
- React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. In a separate terminal, start the Socket.IO server:

```bash
npm run server
```

The application will be available at `http://localhost:5173` or `http://localhost:5174`

## Usage

### User Features

- Chat with other users and admins
- Report issues
- Track issue status
- Receive real-time updates

### Admin Features

- Monitor all conversations
- Manage issues
- Add issue updates
- Resolve issues with notes
- Filter and sort issues
- Receive notifications

## Project Structure

```
my-project/
├── src/
│   ├── Page/
│   │   ├── Chating.jsx       # Main chat component
│   │   └── ...
│   ├── Context/
│   │   └── ContextPage.jsx   # Application context
│   └── App.jsx              # Main application component
├── server.js                # Socket.IO server
└── package.json            # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
