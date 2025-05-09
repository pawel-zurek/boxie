.PHONY: run run-frontend run-backend

run:
	@echo "Starting frontend and backend..."
	(cd frontend && npm run dev &) && \
	(cd backend && make run)

run-frontend:
	cd frontend && npm run dev

run-backend:
	cd backend && make run
