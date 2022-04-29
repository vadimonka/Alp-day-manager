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
    now_date = datetime.today().strftime('%Y-%m-%d')
    current_user = request.user
    count_a = 0
    count_b = 0
    count_c = 0


    if request.method == 'POST':
        pass

    if request.method == 'GET':

        date_from = request.GET.get('date_from')
        date_to = request.GET.get('date_to')

        if date_from and date_to:
            date_from = datetime.strptime(date_from, '%d-%m-%Y').strftime('%Y-%m-%d')
            date_to = datetime.strptime(date_to, '%d-%m-%Y').strftime('%Y-%m-%d')

            lists = List.objects.all().filter(date__gte=date_from, user__pk=current_user.pk).exclude(date__gt=date_to)

            for list_ in lists:
                count_a += list_.task.all().filter(priority__priority='A').count()
                count_b += list_.task.all().filter(priority__priority='B').count()
                count_c += list_.task.all().filter(priority__priority='C').count()
            print(f'{count_a}  - a')
            print(f'{count_b}  - b')
            print(f'{count_c}  - c')
            
            response_data = {
                'count_a': count_a,
                'count_b': count_b,
                'count_c': count_c,
            }

            return JsonResponse(response_data)

        return render (
            request, 
            'statistics.html',
            context={
            }
        )