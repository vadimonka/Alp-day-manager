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
    work_time = 480
    now_date = datetime.today().strftime('%Y-%m-%d')
    yesterday_date_list = [(datetime.today() - timedelta(i)).strftime('%d-%m-%Y') for i in range(1,4)]
    in_work_status_obj = Status.objects.get(status='В работе')
    done_status_obj = Status.objects.get(status='Выполнена')
    delete_status_obj = Status.objects.get(status='Удалена')
    current_user = request.user

    try:
        list_today = List.objects.get(date=now_date, user__pk=current_user.pk)
        task_gen = list_today.task.all().filter(~Q(status__status='Удалена'))
        task_a = task_gen.filter(priority__priority='A')
        task_b = task_gen.filter(priority__priority='B')
        task_c = task_gen.filter(priority__priority='C')
        sum_time_task = sum_time(task_gen)
        free_time = f_time(work_time, sum_time_task)
        over_time = o_time(work_time, sum_time_task)

    except List.DoesNotExist:
        list_today = List()
        list_today.user = User.objects.get(pk=current_user.pk)
        list_today.save()
        task_gen = None
        task_a = None
        task_b = None
        task_c = None
        sum_time_task = 0
        free_time = 0
        over_time = 0
        print('Список задач на сегодня не найден. Создаем новый пустой список..')
        logger.info(f"{request.user} - Список задач на сегодня не найден, создаем новый пустой список.")
    except:
        logger.error(f"{request.user} - uncaught exception: %s", traceback.format_exc())


    if request.method == 'POST':
        logger.info(f"{request.user} - POST REQUEST >>")
        post_data = json.loads(request.body.decode("utf-8"))
        print(f'*****************************************{post_data}')
        
        if post_data:
            # DELETE TASK
            if len(post_data) == 1:
                logger.info(f"{request.user} - DELETE TASK")
                task = Task.objects.get(id=post_data['task_id'])
                task.status = delete_status_obj
                task.save(update_fields=['status'])
                print(f'*******************************************у задачи {task} изменился статус на "удалена" DELETED')
                
                data = {
                    "task_pk_returned": task.pk,
                }

            # UPDATE STATUS
            elif len(post_data) == 2:
                logger.info(f"{request.user} - UPDATE STATUS")
                task = Task.objects.get(pk=post_data['task_id'])
                if task.status.status == 'В работе':
                    task.status = done_status_obj
                    task.save(update_fields=['status'])
                    data = {
                        "task_pk_returned": task.pk,
                        "task_status": str(done_status_obj),
                    }
                    print(f'**********************************у задачи {post_data["task_id"]} статус поменян на "Выполнено"')

                elif task.status.status == 'Выполнена':
                    task.status = in_work_status_obj
                    task.save(update_fields=['status'])
                    data = {
                        "task_pk_returned": task.pk,
                        "task_status": str(in_work_status_obj),
                    }
                    print(f'**********************************у задачи {post_data["task_id"]} статус поменян на "В работе"')
                    
            # UPDATE / CREATE TASK
            else:
                logger.info(f"{request.user} - UPDATE / CREATE TASK")
                task, created = Task.objects.update_or_create(
                    pk=post_data['task_id'],
                    defaults = {
                        'content': post_data['task_content'].strip(),
                        'time': post_data['task_time'].strip(),
                        'priority': Priority.objects.get(priority=post_data['task_priority']),
                        'status': in_work_status_obj
                    }
                )
                if 'date' in post_data.keys():
                    date = datetime.strptime(str(post_data['date']), '%d-%m-%Y')
                else:
                    date = now_date
                print(f'**********************************задача {task.pk} на дату {date} добавлена/обновлена успешно')
                List.objects.get(date=date, user__pk=current_user.pk).task.add(task)
                
                data = {
                    "task_pk_returned": task.pk,
                    "task_content_returned": task.content,
                    "task_time_returned": task.time,
                    "task_priority": str(task.priority),
                }

            # достаем задачи которые не имеют статус - "Удалена"
            task_gen = list_today.task.all().filter(~Q(status__status='Удалена'))
            task_a = task_gen.filter(priority__priority='A')
            task_b = task_gen.filter(priority__priority='B')
            task_c = task_gen.filter(priority__priority='C')

            sum_time_task = sum_time(task_gen)
            free_time = f_time(work_time, sum_time_task)
            over_time = o_time(work_time, sum_time_task)
            
            response_data = {
                "free_time": free_time,
                "over_time": over_time,
                "time_general": sum_time_task,
                'time_a': sum_time(task_a),
                'time_b': sum_time(task_b),
                'time_c': sum_time(task_c),
                "quantity_task_general": sum_task(task_gen),
                "quantity_task_a": sum_task(task_a),
                "quantity_task_b": sum_task(task_b),
                "quantity_task_c": sum_task(task_c),
                "percent_a": percent_part(task_gen, task_a),
                "percent_b": percent_part(task_gen, task_b),
                "percent_c": percent_part(task_gen, task_c),
            }

            response_data.update(data)

        return JsonResponse(response_data)

    elif request.method == 'GET':
        logger.info(f"{request.user} - GET REQUEST >>")
        try:
            get_date = request.GET.get('date')
        except:
            get_date = None
            logger.error(f"{request.user} - Данные в запросе пустые или не существуют.")

        if get_date:
            print('************************************************выполняем запрос get_date')
            try:
                g_d = datetime.strptime(get_date, '%d-%m-%Y')
                n_d = datetime.strptime(datetime.today().strftime('%Y-%m-%d'), '%Y-%m-%d')
                get_date = g_d.strftime('%Y-%m-%d')
                date_eq = True if g_d >= n_d else False
            # если пришедшая дата не соответствует реальной дате, то передаем ошибку
            except:
                date_eq = None
                response_yesterday_data = {
                    "error": 'Date is not valid',
                }
                logger.error(f"{request.user} - Дата из запроса не походит на реальную дату.")

            try:
                list_yesterday = List.objects.get(date=get_date, user__pk=current_user.pk)
                task_gen = list_yesterday.task.all().filter(~Q(status__status='Удалена'))
                task_a = task_gen.filter(priority__priority='A')
                task_b = task_gen.filter(priority__priority='B')
                task_c = task_gen.filter(priority__priority='C')
                sum_time_task = sum_time(task_gen)
                free_time = f_time(work_time, sum_time_task)
                over_time = o_time(work_time, sum_time_task)

                response_yesterday_data = {
                    'work_time': work_time,
                    'free_time': free_time,
                    'over_time': over_time,
                    'task_a': serializers.serialize("json", task_a),
                    'task_b': serializers.serialize("json", task_b),
                    'task_c': serializers.serialize("json", task_c),
                    'time_general': sum_time_task,
                    'time_a': sum_time(task_a),
                    'time_b': sum_time(task_b),
                    'time_c': sum_time(task_c),
                    'quantity_task_general': sum_task(task_gen),
                    'quantity_task_a': sum_task(task_a),
                    'quantity_task_b': sum_task(task_b),
                    'quantity_task_c': sum_task(task_c),
                    'percent_a': percent_part(task_gen, task_a),
                    'percent_b': percent_part(task_gen, task_b),
                    'percent_c': percent_part(task_gen, task_c),
                    'date_eq': date_eq,
                }
            except:
                # если дата меньше текущей, то передаем ошибку
                if date_eq == False:
                    response_yesterday_data = {
                        "error": 'На эту дату вы не планировали задач',
                    }
                    logger.error(f"{request.user} - Дата из запроса меньше текущей, создать список задач на день из прошлого нельзя.")
                # если дата больше или равна текущей
                elif date_eq:
                    list_future = List(date=get_date)
                    list_future.user = User.objects.get(pk=current_user.pk)
                    list_future.save()
                    task_gen = []
                    task_a = []
                    task_b = []
                    task_c = []
                    sum_time_task = 0
                    free_time = f_time(work_time, sum_time_task)
                    over_time = 0
                    print('Список задач на эту дату не задан. Создаем новый пустой список..')

                    response_yesterday_data = {
                        'work_time': work_time,
                        'free_time': free_time,
                        'over_time': over_time,
                        'task_a': serializers.serialize("json", task_a),
                        'task_b': serializers.serialize("json", task_b),
                        'task_c': serializers.serialize("json", task_c),
                        'time_general': sum_time_task,
                        'time_a': sum_time(task_a),
                        'time_b': sum_time(task_b),
                        'time_c': sum_time(task_c),
                        'quantity_task_general': sum_task(task_gen),
                        'quantity_task_a': sum_task(task_a),
                        'quantity_task_b': sum_task(task_b),
                        'quantity_task_c': sum_task(task_c),
                        'percent_a': percent_part(task_gen, task_a),
                        'percent_b': percent_part(task_gen, task_b),
                        'percent_c': percent_part(task_gen, task_c),
                        'date_eq': date_eq,
                    }
                    logger.error(f"{request.user} - Дата из запроса больше или равна текущей, создаем новый список на эту дату")

            return JsonResponse(response_yesterday_data)
        
        else:
            return render(
                request,
                'index.html',
                context={
                    'work_time': work_time,
                    'free_time': free_time,
                    'over_time': over_time,
                    'task_a': task_a,
                    'task_b': task_b,
                    'task_c': task_c,
                    'time_general': sum_time_task,
                    'time_a': sum_time(task_a),
                    'time_b': sum_time(task_b),
                    'time_c': sum_time(task_c),
                    'quantity_task_general': sum_task(task_gen),
                    'quantity_task_a': sum_task(task_a),
                    'quantity_task_b': sum_task(task_b),
                    'quantity_task_c': sum_task(task_c),
                    'percent_a': percent_part(task_gen, task_a),
                    'percent_b': percent_part(task_gen, task_b),
                    'percent_c': percent_part(task_gen, task_c),
                    'now_date': datetime.today().strftime('%d-%m-%Y'),
                    "yesterday_date_list": yesterday_date_list
                }
            )


def f_time(work_time, sum_time_task):
    if work_time >= sum_time_task:
        free_time = work_time - sum_time_task
    else:
        free_time = 0
    return free_time


def o_time(work_time, sum_time_task):
    if work_time <= sum_time_task:
        over_time = sum_time_task - work_time
    else:
        over_time = 0
    return over_time


def sum_task(task):
    quantity_task = 0
    if task != None or 0 or []:
        for t in task:
            quantity_task+=1
    return quantity_task


def percent_part(task, task_q):
    part = 0
    if task != None and len(task) != 0 and task_q != None:
        part = 100 / len(task) * len(task_q)
        part = round(part)
    return part


def sum_time(task):
    time = 0
    if task != None or 0 or []:
        for t in task:
            time += t.time
    return time
