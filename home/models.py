from django.db import models
from django.contrib.auth.models import Permission, User
from django.utils import timezone

class Box(models.Model):
    boxID = models.CharField(primary_key=True, max_length=10,default=0)
    boxNumber = models.IntegerField(default=0)
    location = models.CharField(max_length=30, default=0)
    state = models.IntegerField(default=0)
    userID = models.ForeignKey(User, default=0, null=True)
    microswitch = models.IntegerField(default=0)
    led = models.IntegerField(default=0)
    image = models.ImageField(default=0)
    lock = models.IntegerField(default=1)

    def __str__(self):
        return self.boxID

class Usage_Info(models.Model):
    userID = models.ForeignKey(User)
    boxID = models.ForeignKey(Box)
    startDate = models.DateField(auto_now_add=True)
    finishDate = models.DateField(default=0)
    additionalFee = models.IntegerField(default=0)
    totalPrice = models.IntegerField(default=0)

    def __str__(self):
        return self.userID
