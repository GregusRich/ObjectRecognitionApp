from django.db import models

class ProcessedImage(models.Model):
    original_image_name = models.CharField(max_length=255)  # Stores the name of the uploaded image
    processed_image = models.TextField()  # Stores the base64-encoded processed image
    points = models.JSONField()  # Stores tagging points as JSON
    labels = models.JSONField()  # Stores labels as JSON
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the record is created

    def __str__(self):
        return self.original_image_name