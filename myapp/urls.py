from django.urls import path
from .views import process_image, upload_image, get_processed_image

urlpatterns = [
    path('api/process-image/', process_image, name='process_image'),
    path('api/upload-image/', upload_image, name='upload_image'),
    path('api/get-image/<int:image_id>/', get_processed_image, name='get_processed_image'),
]
