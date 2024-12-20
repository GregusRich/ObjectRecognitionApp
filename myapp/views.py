from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .sam2_model import predictor
from .models import ProcessedImage
from django.shortcuts import get_object_or_404
import numpy as np
from PIL import Image, ImageOps
import json
import torch
from io import BytesIO
import base64

# Define a single mask color with transparency
MASK_COLOR = (0, 0, 255, 128)  # Blue with transparency

@csrf_exempt
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']
        return JsonResponse({"message": "Image uploaded successfully"})
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def process_image(request):
    try:
        if request.method == 'POST' and request.FILES.get('image'):
            image_file = request.FILES['image']
            original_image = Image.open(image_file).convert('RGB')
            original_image = ImageOps.exif_transpose(original_image)

            # Load data for points and labels from the request
            data = request.POST.get('data', '{}')
            prompts = json.loads(data)
            points = prompts.get('points', [])
            labels = prompts.get('labels', [])

            # Convert points to the correct scale based on the image size
            image_np = np.array(original_image)
            width, height = original_image.size
            points_scaled = [[float(point[0]) * width, float(point[1]) * height] for point in points]

            # Convert points and labels to numpy arrays for prediction
            points_np = np.array(points_scaled)
            labels_np = np.array(labels, dtype=np.int32)

            # Set the image for the predictor (this generates an image embedding)
            predictor.set_image(image_np)

            # Perform prediction using all collected points with single mask mode
            with torch.inference_mode():
                masks, scores, logits = predictor.predict(
                    point_coords=points_np,
                    point_labels=labels_np,
                    multimask_output=False  # Single mask output for refinement
                )

            # Retrieve the best mask
            mask = masks[0]

            # Begin with a fresh copy of the original image for each selection
            combined_image = original_image.convert('RGBA')

            # Apply the mask using the predefined blue overlay color
            mask_image = Image.fromarray((mask * 255).astype(np.uint8))
            overlay = Image.new('RGBA', original_image.size, (255, 0, 0, 0))
            overlay.paste(MASK_COLOR, mask=mask_image)
            combined_image = Image.alpha_composite(combined_image, overlay)

            # Save the combined image and return it as a base64 string
            buffer = BytesIO()
            combined_image.save(buffer, format='PNG')
            img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')

            # Save to database
            ProcessedImage.objects.create(
                original_image_name=image_file.name,
                processed_image=img_str,
                points=points,
                labels=labels
            )

            return JsonResponse({'image': img_str})

        return JsonResponse({'error': 'Invalid request'}, status=400)
    except Exception as e:
        import traceback
        traceback_str = ''.join(traceback.format_exception(None, e, e.__traceback__))
        print(traceback_str)
        return JsonResponse({'error': 'Server error', 'message': str(e)}, status=500)

def get_processed_image(request, image_id):
    if request.method == 'GET':
        # Fetch the processed image from the database by ID
        processed_image = get_object_or_404(ProcessedImage, id=image_id)
        return JsonResponse({
            'original_image_name': processed_image.original_image_name,
            'processed_image': processed_image.processed_image,
            'points': processed_image.points,
            'labels': processed_image.labels,
            'created_at': processed_image.created_at
        }, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def update_image_metadata(request, image_id):
    if request.method == 'PUT':
        # Fetch the processed image by ID
        processed_image = get_object_or_404(ProcessedImage, id=image_id)

        # Parse the updated metadata from the request body
        body = json.loads(request.body.decode('utf-8'))
        updated_points = body.get('points', processed_image.points)
        updated_labels = body.get('labels', processed_image.labels)

        # Update the metadata
        processed_image.points = updated_points
        processed_image.labels = updated_labels
        processed_image.save()

        return JsonResponse({
            'message': 'Metadata updated successfully',
            'points': processed_image.points,
            'labels': processed_image.labels
        }, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
