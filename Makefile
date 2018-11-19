.PHONY: app

DOCKER_NETWORK 		= feature_toogle_network
DOCKER_NAME_DB 		= postgres_db
POSTGRES_USER 		= orbis_user
POSTGRES_PASSWORD   = 1523orbis_und
POSTGRES_DB         = orbis_toggles_db

network:
	@if [ ! -n "$(shell docker network ls | grep $(DOCKER_NETWORK))" ]; then \
		docker network create $(DOCKER_NETWORK); \
	fi

db:
	@docker run --rm -d \
		--network=$(DOCKER_NETWORK) \
		--name $(DOCKER_NAME_DB) \
		-p 5432 \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-v $(PWD)/data:/var/lib/postgresql/data \
		postgres:10-alpine

app: db
	@docker run --rm -d \
		--network=$(DOCKER_NETWORK) \
		--name unleash_app \
		-p 4242:4242 \
		-e DATABASE_URL=postgres://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(DOCKER_NAME_DB)/$(POSTGRES_DB) \
		unleash-docker_web:latest \
		npm run start

admin:
	@docker run --rm -d \
		--network=$(DOCKER_NETWORK) \
		--name postgres_admin \
		-p 8080:8080 \
		adminer

start:
	@make network
	@make app
	@make admin

remove:
	docker rm -f postgres_admin postgres_db unleash_app

stop:
	docker stop postgres_admin postgres_db unleash_app
