from django.urls import path
from . import views

urlpatterns = [
    # API endpoint for image upload
    path('api/upload-image/', views.upload_image, name='upload_image'),
]
