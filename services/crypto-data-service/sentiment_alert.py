# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/sentiment_alert.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from real_time_sentiment import monitor_sentiment

"""
Market Sentiment Alert System
"""

def send_email_alert(subject: str, body: str, recipient: str):
    """
    Send an email alert with the specified subject and body.
    Args:
        subject: Subject of the email.
        body: Body of the email.
        recipient: Recipient email address.
    """
    sender_email = "your_email@example.com"
    sender_password = "your_password"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient, msg.as_string())
        print(f"Alert sent to {recipient}")
    except Exception as e:
        print(f"Failed to send alert: {e}")

def monitor_and_alert(keyword: str, recipient: str):
    """
    Monitors sentiment for a specific keyword and sends alerts on extreme sentiment changes.
    Args:
        keyword: Keyword to monitor (e.g., 'Bitcoin').
        recipient: Recipient email address for alerts.
    """
    sentiment_summary = monitor_sentiment(lambda: keyword)
    if sentiment_summary['positive'] > sentiment_summary['negative'] * 2:
        send_email_alert(f"Positive Sentiment Alert: {keyword}",
                         f"Sentiment has spiked positively for {keyword}.",
                         recipient)
    elif sentiment_summary['negative'] > sentiment_summary['positive'] * 2:
        send_email_alert(f"Negative Sentiment Alert: {keyword}",
                         f"Sentiment has spiked negatively for {keyword}.",
                         recipient)
