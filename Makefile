setup:
	@make build
	@make up 
	@make composer-update

build:
	docker-compose build --no-cache --force-rm
up:
	docker-compose up -d

down: 
	docker-compose down

stop:
	docker-compose stop

composer-update:
	docker exec laravel-api bash -c "composer update"

data:
	docker exec laravel-api bash -c "php artisan migrate"
	