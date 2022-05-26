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
    sum_task_with_priority_a = 0
    sum_task_with_priority_b = 0
    sum_task_with_priority_c = 0
    sum_task_with_status_inwork = 0
    sum_task_with_status_done = 0
    sum_task_with_status_deleted = 0
<<<<<<< HEAD
    i = 0
    data = {}
    tasks = []
    response_data = {
        "data": {}
    }
=======

>>>>>>> projectremote/dev

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
                sum_task_with_priority_a += list_.task.all().filter(priority__priority='A').count()
                sum_task_with_priority_b += list_.task.all().filter(priority__priority='B').count()
                sum_task_with_priority_c += list_.task.all().filter(priority__priority='C').count()
                sum_task_with_status_inwork += list_.task.all().filter(status__status='В работе').count()
                sum_task_with_status_done += list_.task.all().filter(status__status='Выполнена').count()
                sum_task_with_status_deleted += list_.task.all().filter(status__status='Удалена').count()
<<<<<<< HEAD
                
                tasks = []
                if len(list_.task.all()) != 0:
                    i += 1
                for task_ in list_.task.all():
                    tasks.append(task_)
                    data = {
                        f"data"+str(i): {
                            "date": list_.date,
                            "tasks": serializers.serialize("json", tasks),
                        }
                    }

                response_data["data"].update(data)

            graf_data = {
=======
            
            response_data = {
>>>>>>> projectremote/dev
                'sum_task_with_priority_a': sum_task_with_priority_a,
                'sum_task_with_priority_b': sum_task_with_priority_b,
                'sum_task_with_priority_c': sum_task_with_priority_c,
                'sum_task_with_status_inwork': sum_task_with_status_inwork,
                'sum_task_with_status_done': sum_task_with_status_done,
                'sum_task_with_status_deleted': sum_task_with_status_deleted,
            }

<<<<<<< HEAD
            response_data.update(graf_data)

            return JsonResponse(response_data)

        else:

            return render (
                request, 
                'statistics.html',
                context={
                }
            )
=======
            return JsonResponse(response_data)

        return render (
            request, 
            'statistics.html',
            context={
            }
        )
>>>>>>> projectremote/dev
