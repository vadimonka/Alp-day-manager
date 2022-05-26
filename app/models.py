from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from .managers import UserManager


class Priority(models.Model):
    priority = models.CharField(max_length=10, help_text="A, B или C приоритет")

    def __str__(self):
        return self.priority


class Status(models.Model):
    status = models.CharField(max_length=20, help_text="Статусы задачи")

    def __str__(self):
        return self.status


class MarkTask(models.Model):
    delegation = models.BooleanField(default=False, help_text="Метка делегирования")
    task = models.ForeignKey('Task', on_delete=models.PROTECT, help_text="Какая задача передана")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, help_text="Кому передана задача")

    def __str__(self):
        return self.delegation


class Task(models.Model):
    content = models.TextField(help_text="Содержимое задачи")
    time = models.IntegerField(help_text="Время на выполнение задачи (в минутах)")
    priority = models.ForeignKey('Priority', on_delete=models.PROTECT, help_text="Приоритет задачи")
    status = models.ForeignKey('Status', on_delete=models.PROTECT, help_text="Статус задачи")

    def __str__(self):
        return self.content


class User(AbstractUser):
    first_name = models.CharField(max_length=30, help_text="Имя пользователя")
    last_name = models.CharField(max_length=30, help_text="Фамилия пользователя")
    middle_name = models.CharField(max_length=30, help_text="Отчество пользователя")
    username = None
    email = models.EmailField('email address', unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


<<<<<<< HEAD
class UserSettings(models.Model):
    workday_time = models.IntegerField(help_text="Длительность рабочего дня")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)

    def __str__(self):
        return str(self.workday_time)


=======
>>>>>>> projectremote/dev
class List(models.Model):
    date = models.DateField(default=datetime.today().strftime('%Y-%m-%d'))
    task = models.ManyToManyField('Task', help_text="Задачи на день")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)

    def __str__(self):
        return self.date.strftime('%Y-%m-%d')
