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
    now_date_display = datetime.today().strftime('%d-%m-%Y')
    in_work_status_obj = Status.objects.get(status='В работе')
    current_user = request.user
    i = 0
    response_data = {}
    data = {}
    bool_ = None
    list_filtered = None

    if request.method == 'POST':
        logger.info(f"{request.user} - POST REQUEST >>")
        post_data = json.loads(request.body.decode("utf-8"))

        if post_data.get("date_from") and post_data.get("date_to"):
            date_from = datetime.strptime(post_data["date_from"], '%d-%m-%Y').strftime('%Y-%m-%d')
            date_to = datetime.strptime(post_data["date_to"], '%d-%m-%Y').strftime('%Y-%m-%d')
            
            list_filtered = List.objects.all().filter(date__gte=date_from, user__pk=current_user.pk).exclude(date__gt=date_to).filter(task__status__status='В работе').distinct().order_by('date')
            
            for ls in list_filtered:
                tasks = []
                i += 1
                for ts in ls.task.all():
                    if ts.status == in_work_status_obj:
                        tasks.append(ts)
                        data = {
                            f"data"+str(i): {
                                "date": ls.date,
                                "tasks": serializers.serialize("json", tasks),
                            }
                        }

                response_data.update(data)

            return JsonResponse(response_data)
        
        if post_data.get("task_list") and post_data.get("date"):
            date_to = datetime.strptime(post_data["date"], '%d-%m-%Y').strftime('%Y-%m-%d')
            try:
                for task_pk in post_data["task_list"]:
                    task = Task.objects.get(pk=task_pk)
                    list_from = List.objects.get(user__pk=current_user.pk, task=task)
                    list_from.task.remove(task)
                    list_to = List.objects.get(user__pk=current_user.pk, date=date_to)
                    list_to.task.add(task)
                bool_ = True
            except List.DoesNotExist:
                list_to = List(date=date_to)
                list_to.user = User.objects.get(pk=current_user.pk)
                list_to.save()
                list_to.task.add(task)
                bool_ = True
            except:
                bool_ = False

            response_data = {
                "status": bool_
            }

        return JsonResponse(response_data)

    if request.method == 'GET':
        logger.info(f"{request.user} - GET REQUEST >>")

        lists = List.objects.all().filter(date__lt=now_date, user__pk=current_user.pk).filter(task__status__status='В работе').distinct().order_by('-date')

        for ls in lists:
            tasks = []
            i += 1
            for ts in ls.task.all():
                if ts.status == in_work_status_obj:
                    tasks.append(ts)
                    data = {
                        f"data"+str(i): {
                            "date": ls.date,
                            "tasks": tasks,
                        }
                    }

            response_data.update(data)

        return render (
            request, 
            'pit.html',
            context={
                'response_data': response_data,
                'now_date': now_date_display
            }
        )
