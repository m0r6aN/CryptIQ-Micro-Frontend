# File path: CryptIQ-Micro-Frontend/services/ai_assistant/smart_sentiment_change_alert_system.py

import smtplib
import pandas as pd

"""
Smart Sentiment Change Alert System
"""

class SmartSentimentChangeAlertSystem:
    def __init__(self, email: str, smtp_server: str, smtp_port: int, smtp_user: str, smtp_pass: str):
        self.email = email
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_pass = smtp_pass

    def monitor_sentiment_changes(self, sentiment_data: pd.DataFrame, sentiment_threshold: float = 0.2):
        """
        Monitor sentiment changes and send alerts if thresholds are breached.
        Args:
            sentiment_data: DataFrame containing sentiment scores.
            sentiment_threshold: Change threshold for triggering an alert.
        """
        sentiment_data['sentiment_change'] = sentiment_data['sentiment_score'].diff().abs()
        significant_changes = sentiment_data[sentiment_data['sentiment_change'] > sentiment_threshold]

        if not significant_changes.empty:
            message = f"Significant Sentiment Change Detected: {significant_changes['sentiment_change'].values.tolist()}"
            self.send_email_alert(message)

    def send_email_alert(self, message: str):
        """
        Send an email alert.
        """
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.smtp_user, self.smtp_pass)
            server.sendmail(self.smtp_user, self.email, message)

# Example usage
data = pd.DataFrame({
    'timestamp': ['2024-10-01', '2024-10-02', '2024-10-03'],
    'sentiment_score': [0.3, 0.5, -0.2]
})
alert_system = SmartSentimentChangeAlertSystem("user@example.com", "smtp.example.com", 587, "smtp_user", "smtp_pass")
alert_system.monitor_sentiment_changes(data, sentiment_threshold=0.15)
