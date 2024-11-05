# File path: CryptIQ-Micro-Frontend/services/trading-service/real_time_risk_alert_system.py

import smtplib
import pandas as pd

"""
Real-Time Risk Alert System
"""

class RealTimeRiskAlertSystem:
    def __init__(self, email: str, smtp_server: str, smtp_port: int, smtp_user: str, smtp_pass: str):
        self.email = email
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_pass = smtp_pass

    def monitor_risk_levels(self, data: pd.DataFrame, risk_threshold: float = 0.5):
        """
        Monitor risk levels in the portfolio and send alerts if thresholds are breached.
        Args:
            data: DataFrame containing 'asset' and 'risk_score' columns.
            risk_threshold: Risk level threshold for triggering an alert.
        """
        high_risk_assets = data[data['risk_score'] > risk_threshold]
        if not high_risk_assets.empty:
            message = f"High Risk Alert for the following assets: {high_risk_assets['asset'].values.tolist()}"
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
data = pd.DataFrame({'asset': ['BTC', 'ETH', 'LTC'], 'risk_score': [0.4, 0.6, 0.3]})
alert_system = RealTimeRiskAlertSystem("user@example.com", "smtp.example.com", 587, "smtp_user", "smtp_pass")
alert_system.monitor_risk_levels(data, risk_threshold=0.5)
