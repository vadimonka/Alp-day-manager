start: run

# backend
pip-install: 
	pip install -r requirements.txt

make-migrations:
	python manage.py makemigrations

migrate:
	python manage.py migrate

run:
	python manage.py runserver 0.0.0.0:4000

# utilities
clean:
	rm -rf alp/__pycache__
	rm -rf app/__pycache__
	rm -rf app/migrations/__pycache__
	rm -rf app/static/dist
	rm -rf .cache
	rm -rf dist
