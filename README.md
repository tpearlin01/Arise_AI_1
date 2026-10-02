# DukaanAI 🛒🤖

DukaanAI is an AI-powered smart assistant for Indian grocery stores (Kirana shops). It takes the hassle out of manual order entry by allowing shopkeepers to input customer orders in natural language (Hinglish). The AI understands the order, matches items with the store's inventory, handles ambiguities, updates stock, and generates invoices instantly.

## 🌟 Features

- **AI-Powered Order Parsing**: Understands conversational Hinglish orders (e.g., "bhaiya 2 kilo atta aur ek amul butter de do kal subah tak").
- **Smart Product Matching**: Uses fuzzy logic and AI to match customer queries with actual inventory items.
- **Interactive Ambiguity Resolution**: If a query is ambiguous (e.g., just "soap"), it prompts the shopkeeper to choose from available options.
- **Inventory & Dashboard**: Real-time tracking of sales, orders, and low-stock alerts.
- **Multi-language Support**: The interface is available in English, Hindi, and Marathi.
- **Automated Invoicing**: Generates clear bills and delivery notes ready for printing.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (via SQLAlchemy)
- **AI Integration**: OpenAI (GPT-3.5/GPT-4) for intent parsing
- **Data Validation**: Pydantic

### Frontend
- **Framework**: React with Vite
- **Styling**: Vanilla CSS with modern UI elements
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- OpenAI API Key

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file and add your OpenAI API Key
echo "OPENAI_API_KEY=your_api_key_here" > .env

# Run the FastAPI server
uvicorn app.main:app --reload
```
The backend will be running at `http://localhost:8000`.

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will be running at `http://localhost:5173`.

## 📂 Project Structure

- `backend/app/main.py`: Entry point for the FastAPI server.
- `backend/app/services/ai_parser.py`: Handles interaction with OpenAI to parse Hinglish orders.
- `backend/app/services/order_service.py`: Core logic for matching products, managing inventory, and handling clarifications.
- `frontend/src/App.jsx`: Main React application containing the dashboard, order creation flow, and catalog.

## 📝 License
This project is licensed under the MIT License.