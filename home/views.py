# Create your views here.
#views.py
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login

from django.views import generic
from django.views.generic import View
from django.views.generic import *

from .forms import UserForm
from django.http import HttpResponse

from .models import Box
from django.contrib.auth.models import User


from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core.urlresolvers import reverse
# GPIO port numbers
'''import wiringpi2 as wiringpi
import time

from picamera import PiCamera
SAVE_PATH = "/home/pi/"

wiringpi.wiringPiSetupGpio()
wiringpi.pinMode(18, 1) # sets GPIO 18 to output'''
location=0
boxNum=0

class AdminLV(ListView):
    #model = Box.objects.filter().select_related()

    model = Box;
    template_name = 'home/admin.html'
    context_object_name = 'boxes'

def lock(request):
    if request.method == "POST":
        lock = request.POST['lock']
        boxID = request.POST['boxID']
        b = get_object_or_404(Box, boxID=boxID)
        if lock == 'close':
            b.lock = 0
            b.save()
        elif lock == 'open':
            b.lock = 1
            b.save()
        else:
            b.save()
    return render(request, 'home/admin.html')
        #return render(request, 'home/box_detail.html')
    #return HttpResponse('')

def home(request):
    return render(request, 'home/home.html')

def mybox(request):
    user = None
    if request.user.is_authenticated():
        user = request.user
    box_list = Box.objects.filter(userID=user)
    context = {'box_list': box_list}

    #if box_list:
    #    for box in box_list:

    return render(request, 'home/myBox.html', context)

class BoxDetail(DetailView):
    model = Box

def detail(request):
    user = None
    if request.user.is_authenticated():
        user = request.user

    if request.method == "POST":
        global boxNum
        boxNum = request.POST.get('box')

        box_list = Box.objects.filter(location=location)
        b = get_object_or_404(box_list, boxNumber=boxNum)
        b.state = 1
        b.userID = user
        b.save()
        return render(request, 'home/home.html')

def select(request):
    if request.method == "POST":
        global location
        location = request.POST.get('location')

        box_list = Box.objects.filter(location=location)
        context = {'box_list': box_list, 'location': location}
        return render(request, 'home/select.html',context)

def insert_data(request):
    if request.method == "POST":
        location = request.POST.get('location')
        boxNumber = request.POST.get('boxNumber')

        Box.objects.create(
        location = location,
        boxNumber = boxNumber,
        state = 1
        )
    return render(request, 'home/home.html')

def logout_user(request):
    logout(request)
    form = UserForm(request.POST or None)
    context = {
        "form": form,
    }
    return render(request, 'home/login.html', context)

def login_user(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        '''if 'camera' in request.POST:
            camera = PiCamera()

            file_path = SAVE_PATH + ".jpg"

            camera.capture(file_path)

            return render(request,'home/index.html')
        if 'on' in request.POST:
            wiringpi.digitalWrite(18, 1) # sets port 18 to 1 (5V, on)
            return render(request,'home/index.html')
        if 'off' in request.POST:
            wiringpi.digitalWrite(18, 0) # sets port 18 to 0 (0V, off)
            return render(request,'home/index.html')'''
        if user is not None:
            if user.is_active:
                login(request, user)
                return render(request, 'home/home.html')
            else:
                return render(request, 'home/login.html', {'error_message': 'Your account has been disabled'})
        else:
            return render(request, 'home/login.html', {'error_message': 'Invalid login'})
    return render(request, 'home/login.html')

def register(request):
    form = UserForm(request.POST or None)
    if form.is_valid():
        user = form.save(commit=False)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        user.set_password(password)
        user.save()
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                return render(request, 'home/login.html')
    return render(request, 'home/register.html')
