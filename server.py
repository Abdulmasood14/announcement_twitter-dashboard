#!/usr/bin/env python3
"""
Simple HTTP Server for Announcement & Twitter Dashboard
Run this file to start a local web server
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = Path(__file__).parent

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def main():
    print("=" * 60)
    print("📊 Company Announcements & Twitter Dashboard")
    print("=" * 60)
    print(f"\n🌐 Starting server on port {PORT}...")
    print(f"📁 Serving files from: {DIRECTORY}")
    
    # Check if required files exist
    required_files = [
        'index.html',
        'styles.css',
        'app.js',
        'data/holding-companies.csv',
        'data/announcements.csv'
    ]
    
    print("\n📋 Checking required files:")
    all_exist = True
    for file in required_files:
        file_path = DIRECTORY / file
        exists = file_path.exists()
        status = "✅" if exists else "❌"
        print(f"  {status} {file}")
        if not exists:
            all_exist = False
    
    if not all_exist:
        print("\n⚠️  Warning: Some required files are missing!")
        print("   Please ensure all files are in place before accessing the dashboard.")
    
    print(f"\n🚀 Server is running!")
    print(f"   Open your browser and navigate to:")
    print(f"   👉 http://localhost:{PORT}")
    print(f"\n   Press Ctrl+C to stop the server")
    print("=" * 60)
    
    # Automatically open browser
    try:
        webbrowser.open(f'http://localhost:{PORT}')
    except:
        pass
    
    # Start server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped by user")
            print("   Goodbye! 👋")

if __name__ == "__main__":
    main()
