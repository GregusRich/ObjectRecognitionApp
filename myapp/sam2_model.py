import torch
import os
import sys

# Add the `sam2` directory to the Python path
base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Get project root
sys.path.append(os.path.join(base_path, "sam2"))

# Use absolute imports for `sam2`
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor

# Paths to your checkpoint and the desired config file
checkpoint = os.path.join(base_path, "sam2/checkpoints/sam2.1_hiera_base_plus.pt")
model_cfg = os.path.join(base_path, "sam2/sam2/configs/sam2.1/sam2.1_hiera_b+.yaml")

# Check if files exist
if not os.path.exists(checkpoint):
    raise FileNotFoundError(f"Checkpoint not found at {checkpoint}")
if not os.path.exists(model_cfg):
    raise FileNotFoundError(f"Config file not found at {model_cfg}")

# Build the model
model = build_sam2(model_cfg, checkpoint)

# Use GPU if available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")
model.to(device)

# Create a predictor instance
predictor = SAM2ImagePredictor(model)

print("SAM 2 initialized successfully.")
