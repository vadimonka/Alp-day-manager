from django.contrib import admin
from .models import *
from .forms import UserCreationForm, UserChangeForm
from django.contrib.auth.admin import UserAdmin

admin.site.register(MarkTask)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('content', 'time', 'priority', 'status', 'pk')
    list_filter = ('status', 'priority')
    

class UserAdmin(UserAdmin):
    add_form = UserCreationForm
    form = UserChangeForm
    model = User
    list_display = ('email', 'first_name', 'last_name', 'middle_name', 'is_staff', 'is_active')
    list_filter = ('email', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('first_name', 'last_name', 'middle_name', 'email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'middle_name', 'email', 'password1', 'password2', 'is_staff', 'is_active', 'groups')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(User, UserAdmin)

@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ('date', 'user')


@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('status', 'pk')


@admin.register(Priority)
class PriorityAdmin(admin.ModelAdmin):
    list_display = ('priority', 'pk')
