# Object Recognition App (Django + Next.js with SAM-2 Integration)

This project integrates the SAM-2 (Segment Anything Model 2) into a Django application for advanced image 
processing functionality using PyTorch. The frontend is built using Next.js to provide a dynamic and user-friendly 
interface.

---

## Setup Instructions

### **Backend (Django + SAM-2)**

### 1. Clone the Repository

```bash
git clone https://github.com/GregusRich/ObjectRecognitionApp.git
cd ObjectRecognitionApp
```

### 2. Create and Activate Virtual Environment

```bash
python -m venv .venv
# On macOS/Linux
source .venv/bin/activate
# On Windows
.venv\Scripts\activate
```

### 3. Install PyTorch

IMPORTANT: Install PyTorch based on your system configuration. Make sure you choose the appropriate 
PyTorch version before installing SAM-2.

For GPU with CUDA Support:

CUDA 12.1:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```
CUDA 11.8:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```
For CPU Only:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### 4. Install SAM-2
```bash
pip install -e git+https://github.com/facebookresearch/sam2.git@c2ec8e14a185632b0a5d8b161928ceb50197eddc#egg=SAM_2
```
### 5. Install Remaining Dependencies
```bash
pip install -r requirements.txt
```
### 6. Running the Application

Start the development server:
```bash
python manage.py runserver
```

---

## Frontend (Next.js)

### 1. Navigate to the nextjs-frontend Directory
```bash
cd nextjs-frontend
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The Next.js frontend will be available at http://localhost:3000.

**Notes:**
- Ensure the sam2 folder is included in the project directory.
- Model checkpoints and configuration files must be in the correct path as referenced in the code.

---

### Requirements:

#### Backend
- Python >= 3.10
- PyTorch >= 2.3.1
- Django >= 5.1.2
- SAM-2
#### Frontend
- Node.js >= 18.0.0
- Next.js >= 13.0.0

---

### **Additional Notes: Handling Missing Files**
If any files related to SAM-2 are missing, you can download the full SAM-2 repository directly from its 
official GitHub repository. Follow the steps below:

#### Download the SAM-2 Repository
```bash
git clone https://github.com/facebookresearch/sam2.git
```
#### Replace the sam2 Folder
1. Delete the existing sam2 folder in the project directory (ObjectRecognitionApp/sam2)
2. Copy the downloaded sam2 folder from the cloned repository into the project directory
3. Ensure that the folder structure matches the following:

```bash
ObjectRecognitionApp/
    sam2/
        checkpoints/
        sam2/
            configs/
                <other files>
                sam2.1/
                    sam2.1_hiera_b+.yaml
                    <other files>
                <other files>
                
```
#### Verify Configuration

Ensure the checkpoints and configs folders are present, and that the referenced files in the project code 
(sam2.1_hiera_base_plus.pt and sam2.1_hiera_b+.yaml) exist within their correct locations.
