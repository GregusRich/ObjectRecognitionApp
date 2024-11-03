from django.shortcuts import render, HttpResponse

# Home Page will display info about what the website does and links to the image recognition page
def home(request):
    return render(request, 'home.html')

# Image recognition page has functionality to upload, tag and process an image
def image_recognition(request):
    return render(request, 'image_recognition.html')
