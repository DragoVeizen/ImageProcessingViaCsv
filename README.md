# Image Processing Backend

## Overview
This project is a **Node.js backend** for processing CSV files that contain product image URLs. It downloads, compresses, and stores images, then generates a new CSV file with the compressed image URLs.

## Features
- Upload CSV files containing product names and image URLs
- Extract and store products and images in a database
- Process images asynchronously using **Bull.js**
- Download, compress, and store processed images
- Generate a CSV file with the processed image URLs
- Webhook integration for tracking request status

## System Architecture
1. User uploads a CSV file
2. The server parses and stores products & images
3. The image processing queue handles image downloads & compression
4. Once all images are processed, a webhook is triggered
5. A CSV file with input and processed image URLs is generated

## Technologies Used
- **Node.js** (Express.js for API)
- **Multer** (for file uploads)
- **Bull.js** (for queue-based processing)
- **Sequelize** (ORM for database operations)
- **PostgreSQL/MySQL** (Database)
- **Sharp.js** (for image processing)
- **Axios** (for making webhook calls)

## Setup Instructions
### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/image-processing-backend.git
cd image-processing-backend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root:
```
DB_NAME=image_process
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=
REDIS_URL=
PORT=
DB_HOST=
DB_DIALECT=
URL_PATH=
```

### 4. Run Database Migrations
```sh
npx sequelize-cli db:migrate
```

### 5. Start the Server
```sh
npm run dev
```

### 6. Start the Worker
```sh
npm run worker
```

## API Endpoints
### **1. Upload CSV**
**Endpoint:** `POST /upload`
**Request:**
```sh
curl -X POST http://localhost:3000/upload -F "file=@test.csv"
```

### **2. Check Processing Status**
**Endpoint:** `GET /status/{requestId}`
**Response:**
```json
{
  "requestId": "12345",
  "status": "completed",
  "products": [
    {
      "name": "SKU1",
      "images": [
        { "input_url": "original.jpg", "output_url": "compressed.jpg" }
      ]
    }
  ]
}
```

### **3. Webhook Trigger**
**Endpoint:** `POST /webhook`
**Payload:**
```json
{
  "requestId": "12345"
}
```
If the request is completed, the CSV will be downloaded locally.

## Folder Structure
```
image-processing-backend/
│── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── workers/
│   ├── uploads/ (stores uploaded files)
│   ├── downloads/ (stores processed CSVs)
│   ├── models/
│   ├── config/
│   ├── app.js
│── package.json
│── README.md
```
## Project Workflow 
<img width="785" alt="image" src="https://github.com/user-attachments/assets/9c682d55-6f54-4159-ac4f-2dbf69043828" />

## Links
- Link to Postman Collection : https://images-processing-via-csv.postman.co/workspace/Images-Processing-via-CSV-Works~49950b55-8e0e-488a-a311-1fc954b26d86/collection/37844804-dae69c93-169b-4826-9df1-13a5c86a699b?action=share&creator=37844804
- Link to Google Doc (Documentation): https://docs.google.com/document/d/1JXG7RD-PI_742hKgiPVgtRGQdbmjj9QDA0llS9dcEJ8/edit?usp=sharing

## Future Improvements
- Implement authentication
- Add cloud storage for images
- Improve error handling and logging

---
🚀 **Happy coding!**

