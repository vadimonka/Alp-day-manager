from django.urls import path, re_path, include
from django.views.generic import RedirectView
from . import views, pit, statistics, user_settings


urlpatterns = [
    re_path(r'^$', views.index, name='index'),
    path('pit', pit.index, name='pit'),
    path('statistics', statistics.index, name='statistics'),
    path('user_settings', user_settings.index, name='user_settings')
]