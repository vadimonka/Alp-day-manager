start: run
dev-i: venv-i venv pip-i migrate run

# backend
pip-i: 
	pip install -r requirements.txt

migrate:
	python manage.py makemigrations
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

venv-i:
	python -m venv env

venv:
	source env/bin/activate