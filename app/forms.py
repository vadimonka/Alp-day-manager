from django import forms
from .models import *
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


class UserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = User
        fields = ('email', 'first_name', 'last_name', 'middle_name',)

class UserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'middle_name',)
