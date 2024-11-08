from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']
        # Process or save the image as needed
        return JsonResponse({"message": "Image uploaded successfully"})
    return JsonResponse({"error": "Invalid request"}, status=400)
