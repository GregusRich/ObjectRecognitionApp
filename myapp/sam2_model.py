import torch
import os
import sys
sys.path.append("C:/Users/grego/sam2")
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor


# Paths to your checkpoint and the desired config file
checkpoint = os.path.abspath("C:/Users/grego/sam2/checkpoints/sam2.1_hiera_base_plus.pt")
model_cfg = os.path.abspath("C:/Users/grego/sam2/sam2/configs/sam2.1/sam2.1_hiera_b+.yaml")

model = build_sam2(model_cfg, checkpoint)
predictor = SAM2ImagePredictor(model)
print("SAM 2 initialized successfully.")

# Use GPU if available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

# Create a predictor instance
predictor = SAM2ImagePredictor(model)
