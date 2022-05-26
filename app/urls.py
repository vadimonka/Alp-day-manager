from django.urls import path, re_path, include
from django.views.generic import RedirectView
<<<<<<< HEAD
from . import views, pit, statistics, user_settings
=======
from . import views, pit, statistics
>>>>>>> projectremote/dev


urlpatterns = [
    re_path(r'^$', views.index, name='index'),
    path('pit', pit.index, name='pit'),
<<<<<<< HEAD
    path('statistics', statistics.index, name='statistics'),
    path('user_settings', user_settings.index, name='user_settings')
]
=======
    path('statistics', statistics.index, name='statistics')
]
>>>>>>> projectremote/dev
