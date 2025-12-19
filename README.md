# 📊 Company Announcements & Twitter Dashboard

A lightweight, portable web dashboard for tracking company announcements and Twitter updates.

## 🚀 Quick Start

### Windows
```bash
# Double-click this file
start.bat
```

### Mac/Linux
```bash
# Run the Python server
python3 server.py
```

### Any Platform
```bash
# Navigate to folder and run
cd announcement-twitter-dashboard
python -m http.server 8000
# Open: http://localhost:8000
```

## ✨ Features

- 📅 **Interactive Calendar** - View updates by date
- 🔍 **Search & Filter** - Find companies quickly
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean, professional interface
- 📊 **Real-time Updates** - Edit CSV files and refresh

## 📁 Project Structure

```
announcement-twitter-dashboard/
├── index.html                  # Main application
├── styles.css                  # Styling
├── app.js                      # JavaScript logic
├── server.py                   # Python server
├── server.js                   # Node.js server
├── start.bat                   # Windows launcher
├── DEPLOYMENT_GUIDE.md         # Full deployment instructions
└── data/
    ├── holding-companies.csv   # Company list
    └── announcements.csv       # Announcements & tweets
```

## 📝 Adding New Data

### Add New Announcement
Edit `data/announcements.csv` and add a row:
```csv
COMPANYNAME,Announcement,2025-12-20,"Your announcement text",,https://source-link.com,Announcement
```

### Add New Tweet
```csv
COMPANYNAME,Twitter,2025-12-20,"Tweet summary",https://twitter.com/status,https://source.com,@channelname
```

### Add New Company
1. Add to `data/holding-companies.csv`:
   ```csv
   SYMBOL,INE123456789,Company Full Name Ltd.
   ```
2. Add announcements using the SYMBOL in `announcements.csv`

**Refresh browser to see changes!**

## 🌐 Deployment

### Static Hosting (Recommended)
- **GitHub Pages**: Free, easy setup
- **Netlify**: Drag & drop deployment
- **Vercel**: One-click deploy
- **Any Web Server**: Copy entire folder

### Share with Others
1. Compress the entire folder to ZIP
2. Share the ZIP file
3. Recipient extracts and runs `start.bat`

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions**

## 🔧 Technical Details

- **100% Client-Side** - No backend required
- **Relative Paths** - Works anywhere
- **CSV-Based** - Easy data management
- **No Build Process** - Edit and refresh
- **Modern JavaScript** - ES6+ features

## 📊 Data Format

### holding-companies.csv
```csv
name,isin,company_name
SYMBOL,INE123456789,Full Company Name Ltd.
```

### announcements.csv
```csv
Company,COMPANY TYPE,DATES,SUMMARY,TWEET_URL,SOURCE_LINK,CHANNEL_NAME
SYMBOL,Announcement,2025-12-15,"Summary text",,https://link.com,Announcement
SYMBOL,Twitter,2025-12-15,"Tweet text",https://twitter.com/x,https://source.com,@channel
```

**Date Format**: `YYYY-MM-DD` (e.g., `2025-12-20`)

## 🎯 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Mobile Browsers

## 📱 Mobile Support

Fully responsive design works on:
- 📱 Smartphones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktops

## 🔒 Privacy

- All data stored in CSV files
- No external API calls
- No tracking or analytics
- Runs completely offline

## 🆘 Troubleshooting

**Data not loading?**
- Use a web server (run `python server.py`)
- Don't open `index.html` directly via file://

**Blank page?**
- Press F12 to open browser console
- Check for JavaScript errors
- Verify CSV files exist in `data/` folder

**CSV errors?**
- Check CSV format matches examples
- Ensure no missing commas
- Use quotes for multi-line text

## 📄 License

Free to use and modify for personal or commercial projects.

## 🎉 Credits

Built with vanilla HTML, CSS, and JavaScript - no frameworks needed!

---

**Ready to use! Just run `start.bat` or `python server.py`** 🚀
