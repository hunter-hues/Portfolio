from flask import Flask, request, jsonify, send_from_directory, redirect, make_response
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes
load_dotenv()  # Load environment variables

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_USER = os.getenv('EMAIL_USER')  # Your Gmail address
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')  # Your Gmail app password
RECIPIENT_EMAIL = "hughesxh@gmail.com"  # Your email to receive messages

# Debug: Print email configuration (without password)
print(f"Email Configuration:")
print(f"SMTP Server: {SMTP_SERVER}")
print(f"SMTP Port: {SMTP_PORT}")
print(f"From Email: {EMAIL_USER}")
print(f"To Email: {RECIPIENT_EMAIL}")
print(f"Password loaded: {'Yes' if EMAIL_PASSWORD else 'No'}")

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        print("\n=== New Contact Form Submission ===")
        data = request.json
        print(f"Received data: {data}")
        
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        
        print(f"Extracted form data:")
        print(f"Name: {name}")
        print(f"Email: {email}")
        print(f"Message: {message}")

        # Create email message
        print("\nCreating email message...")
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = f"Portfolio Contact Form: Message from {name}"

        body = f"""
        Name: {name}
        Email: {email}
        Message: {message}
        """
        msg.attach(MIMEText(body, 'plain'))
        print("Email message created successfully")

        # Send email
        print("\nAttempting to send email...")
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            print("Connected to SMTP server")
            server.starttls()
            print("TLS started")
            print("Attempting login...")
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            print("Login successful")
            print("Sending message...")
            server.send_message(msg)
            print("Message sent successfully!")

        print("\n=== Email Process Completed Successfully ===")
        return jsonify({"success": True, "message": "Message sent successfully!"})

    except Exception as e:
        print(f"\n=== ERROR in Contact Form Processing ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print(f"Error details: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)