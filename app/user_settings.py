from .models import *

from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core import serializers
from datetime import timedelta
import json
import math
import logging.config
import traceback


logging.config.fileConfig('app/debug/logging.ini', disable_existing_loggers=False)
logger = logging.getLogger(__name__)

@login_required()
def index(request):
    current_user = request.user

    if request.method == 'POST':
        logger.info(f"{request.user} - POST REQUEST >>")
        post_data = json.loads(request.body.decode("utf-8"))

        try:
            user_set = UserSettings.objects.get(user__pk=current_user.pk)
            if user_set.workday_time != post_data['workday_time']:
                user_set.workday_time = post_data['workday_time']
                user_set.save(update_fields=['workday_time'])

        except UserSettings.DoesNotExist:
            user_set = UserSettings(workday_time=post_data['workday_time'])
            user_set.user = User.objects.get(pk=current_user.pk)
            user_set.save()

        response_data = {
            "operation": 'success'
        }

        return JsonResponse(response_data)


    if request.method == 'GET':
        logger.info(f"{request.user} - GET REQUEST >>")
        work_time = UserSettings.objects.get(user__pk=current_user.pk).workday_time

        return render (
            request, 
            'user_settings.html',
            context={
                "work_time": work_time,
                "checked": 'checked'
            }
        )