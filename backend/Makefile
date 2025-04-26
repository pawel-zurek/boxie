# Install all project dependencies
install:
	pip install -r requirements.txt

# Run the backend server
run:
	uvicorn app.main:app --reload

# Format code using black
format:
	black app/ api/ crud/ schemas/ models/ core/

# Clean up compiled files
clean:
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -exec rm -r {} +

# Generate new requirements.txt
freeze:
	pip freeze > requirements.txt
