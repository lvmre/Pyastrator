"""
Main Flask application for Pyastrator design tool
"""
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_wtf.csrf import CSRFProtect
import os
import logging
from logging.handlers import RotatingFileHandler
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.config.from_object("config.Config")

# Enable CSRF protection
csrf = CSRFProtect(app)

# Fix for running behind a proxy
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

# Configure logging for production
if not app.debug:
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/pyastrator.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Pyastrator startup')

# Routes
@app.route("/")
def index():
    """Home page route"""
    return render_template("index.html")

@app.route("/design")
def design():
    """Main design tool interface"""
    return render_template("design.html")

@app.route("/design/<int:design_id>")
def load_design(design_id):
    """Load an existing design"""
    # Here you would fetch the design data from your database
    # For now, we'll return a template with the design_id
    return render_template("design.html", design_id=design_id)

@app.route("/api/designs", methods=["GET"])
def get_designs():
    """API endpoint to get all designs for the current user"""
    # This would typically check authentication and return user's designs
    designs = [
        {"id": 1, "name": "Design 1", "updated_at": "2023-01-01"},
        {"id": 2, "name": "Design 2", "updated_at": "2023-01-02"}
    ]
    return jsonify({"designs": designs})

@app.route("/api/designs", methods=["POST"])
def create_design():
    """API endpoint to create a new design"""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    # Validate and save the new design
    # For now, we'll just echo back with a fake ID
    return jsonify({
        "id": 3,
        "name": data.get("name", "Untitled"),
        "data": data.get("data", {})
    }), 201

@app.route("/api/designs/<int:design_id>", methods=["GET"])
def get_design(design_id):
    """API endpoint to get a specific design"""
    # This would fetch the design from your database
    design_data = {
        "id": design_id,
        "name": f"Design {design_id}",
        "data": {"elements": []}
    }
    return jsonify(design_data)

@app.route("/api/designs/<int:design_id>", methods=["PUT"])
def update_design(design_id):
    """API endpoint to update a design"""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    # Update the design in your database
    return jsonify({"status": "success", "id": design_id})

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error('Server Error: %s', (error))
    return render_template('errors/500.html'), 500

if __name__ == "__main__":
    # For production, use a WSGI server like Gunicorn
    app.run(debug=False)
