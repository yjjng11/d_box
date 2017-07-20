from django.conf.urls import url
from . import views


app_name = 'home'

urlpatterns = [

    url(r'^$', views.login_user, name='login_user'),
    url(r'^register/$', views.register, name='register'),
    url(r'^login_user/$', views.login_user, name='login_user'),
    url(r'^logout_user/$', views.logout_user, name='logout_user'),
    url(r'^insert_data/$', views.insert_data, name='insert_data'),
    url(r'^select/$', views.select, name='select'),
    url(r'^detail/$', views.detail, name='detail'),
    url(r'^mybox/$', views.mybox, name='mybox'),
    url(r'^mybox/(?P<pk>[A-Z0-9]+)/$', views.BoxDetail.as_view(), name='box_detail'),
    url(r'^home/$', views.home, name='home'),
    url(r'^lock/$', views.lock, name='lock'),
]
