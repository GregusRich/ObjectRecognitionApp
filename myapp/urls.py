from django.urls import path
from . import views

urlpatterns = [
    path('api/upload-image/', views.upload_image, name='upload_image'),
    path('api/process-image/', views.process_image, name='process_image'),
]

