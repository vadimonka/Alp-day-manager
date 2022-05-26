==============================
Менеджер задач по методу Альпа
==============================

Поставить глобально python 3.8.10 или выше
Поставить глобально nginx
Файл secret_key.txt создать в корне проекта и записать туда новый сгенерированный ключ


Инструкция по локальному развертыванию
---------------------------

1. Склонировать репозиторий git clone
2. Создать вирт. окружение python3 -m venv env
3. Активировать окружение source env/bin/activate
4. Установить зависимости pip install -r requirements.txt
5. Можно запускать

*Перед деплоем собрать всю статику через collectstatic*


Инструкции по деплою
--------------------

Для деплоя используется gunicorn + nginx.

в каталоге /etc/nginx/sites-available
создать файл alp_django без расширения
содержимое файла:

server {
    listen 80;
    server_name 10.224.4.195;

    #location = /favicon.ico { access_log off; log_not_found off; }
    location /staticfiles/ {
      root /var/www/alp_django/staticfiles;           #путь до static каталога
    }
    location /media/ {
      root /var/www/alp_django/app/;           #путь до media каталога
    }
    location / {
      include proxy_params;
      proxy_pass http://unix:/run/gunicorn.sock;
    }
}


в каталоге /etc/systemd/system
создать файлы gunicorn.socket, gunicorn.service

**содержимое gunicorn.service**

[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/var/www/alp_django/
ExecStart=/var/www/alp_django/env/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          alp.wsgi:application

[Install]
WantedBy=multi-user.target


**содержимое gunicorn.socket**

[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target
