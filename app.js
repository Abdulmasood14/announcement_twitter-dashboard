// ===== Global State =====
let holdingCompanies = [];
let announcementsData = [];
let selectedDate = null;
let companyDataMap = new Map();
let availableDates = [];
let currentMonth = new Date();
let currentView = 'categories'; // 'categories' or 'details'
let currentCategory = null; // 'announcements' or 'twitter'
let currentCompanyData = null;
let searchQuery = ''; // Search input value

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Dashboard...');
    await loadData();
    renderCalendar();
    renderCompanies();
    setupEventListeners();
});

// ===== Load CSV Data =====
async function loadData() {
    try {
        const holdingResponse = await fetch('data/holding-companies.csv');
        const holdingText = await holdingResponse.text();
        holdingCompanies = parseCSV(holdingText);
        console.log(`✅ Loaded ${holdingCompanies.length} holding companies`);

        const announcementsResponse = await fetch('data/announcements.csv');
        const announcementsText = await announcementsResponse.text();
        announcementsData = parseCSV(announcementsText);
        console.log(`✅ Loaded ${announcementsData.length} announcement/twitter entries`);

        processData();
    } catch (error) {
        console.error('❌ Error loading data:', error);
        document.getElementById('companiesGrid').innerHTML = `
            <div class="loading" style="color: #ef4444;">
                <p>⚠️ Error loading data. Please ensure CSV files are in the 'data' folder.</p>
            </div>
        `;
    }
}

// ===== Parse CSV Line (handles commas in quotes) =====
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);
    return result;
}

// ===== Parse CSV with Multi-line Support =====
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = parseCSVLine(lines[0]).map(h => h.trim());

    const data = [];
    let i = 1;

    while (i < lines.length) {
        if (!lines[i].trim()) {
            i++;
            continue;
        }

        // Collect full row (may span multiple lines if quoted)
        let fullLine = lines[i];
        let quoteCount = (fullLine.match(/"/g) || []).length;

        // If odd number of quotes, field continues on next line
        while (quoteCount % 2 !== 0 && i + 1 < lines.length) {
            i++;
            fullLine += '\n' + lines[i];
            quoteCount = (fullLine.match(/"/g) || []).length;
        }

        const values = parseCSVLine(fullLine);
        const row = {};

        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : '';
        });

        data.push(row);
        i++;
    }

    return data;
}

// ===== Process Data and Create Mappings =====
function processData() {
    const datesSet = new Set();

    announcementsData.forEach(entry => {
        let dateStr = entry.DATES || entry.dates || entry.Date || '';
        if (dateStr) {
            dateStr = dateStr.trim();
            datesSet.add(dateStr);
        }
    });

    availableDates = Array.from(datesSet).sort().reverse();
    console.log(`📅 Found ${availableDates.length} unique dates:`, availableDates);

    if (availableDates.length > 0) {
        const firstDate = parseDate(availableDates[0]);
        if (firstDate) {
            currentMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
        }
    }

    holdingCompanies.forEach(company => {
        const companyName = company.company_name || company.name || '';
        const companySymbol = company.name || '';

        if (!companyName) return;

        const companyEntries = announcementsData.filter(entry => {
            const entryCompany = (entry.Company || entry.company || '').trim();

            return entryCompany.toLowerCase() === companyName.toLowerCase() ||
                entryCompany.toLowerCase() === companySymbol.toLowerCase() ||
                entryCompany.toUpperCase() === companySymbol.toUpperCase();
        });

        if (companyEntries.length > 0) {
            companyDataMap.set(companySymbol, {
                company: company,
                entries: companyEntries,
                announcements: companyEntries.filter(e =>
                    (e['COMPANY TYPE'] || e.type || '').toLowerCase() === 'announcement'
                ),
                twitter: companyEntries.filter(e =>
                    (e['COMPANY TYPE'] || e.type || '').toLowerCase() === 'twitter'
                )
            });
        }
    });

    console.log(`🔗 Mapped ${companyDataMap.size} companies with data`);
    updateStats();
}

// ===== Parse Date from String =====
function parseDate(dateStr) {
    if (!dateStr) return null;

    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);

        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            return new Date(year, month, day);
        }
    }

    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
}

// ===== Update Statistics =====
function updateStats() {
    document.getElementById('totalCompanies').textContent = holdingCompanies.length;
    // document.getElementById('companiesWithData').textContent = companyDataMap.size;
    document.getElementById('selectedDate').textContent = selectedDate ? formatDate(selectedDate) : 'All Dates';
}

// ===== Render Calendar =====
function renderCalendar() {
    const calendar = document.getElementById('calendar');

    if (availableDates.length === 0) {
        calendar.innerHTML = '<div class="loading">No dates available</div>';
        return;
    }

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateCounts = {};
    availableDates.forEach(dateStr => {
        dateCounts[dateStr] = announcementsData.filter(entry =>
            (entry.DATES || entry.dates || entry.Date || '').trim() === dateStr
        ).length;
    });

    let calendarHTML = `
        <div class="calendar-header">
            <button class="calendar-nav" id="prevMonth">◀</button>
            <div class="calendar-month">${monthName}</div>
            <button class="calendar-nav" id="nextMonth">▶</button>
        </div>
        <div class="calendar-weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
        </div>
        <div class="calendar-days">
    `;

    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasData = availableDates.includes(dateStr);
        const count = dateCounts[dateStr] || 0;
        const isSelected = selectedDate === dateStr;

        calendarHTML += `
            <div class="calendar-day ${hasData ? 'has-data' : ''} ${isSelected ? 'selected' : ''}" 
                 data-date="${dateStr}">
                <div class="day-number">${day}</div>
            </div>
        `;
    }

    calendarHTML += '</div>';
    calendar.innerHTML = calendarHTML;
}

// ===== Format Date =====
function formatDate(dateStr) {
    const date = parseDate(dateStr);
    if (!date) return dateStr;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

// ===== Render Companies =====
function renderCompanies(filterDate = null, search = '') {
    const grid = document.getElementById('companiesGrid');

    let companiesToShow = [];

    // Only show companies that have data
    holdingCompanies.forEach(company => {
        const symbol = company.name || '';
        const name = company.company_name || symbol;
        const data = companyDataMap.get(symbol);

        if (!data) return; // Skip companies without data

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            const matchesSearch = symbol.toLowerCase().includes(searchLower) ||
                name.toLowerCase().includes(searchLower);
            if (!matchesSearch) return;
        }

        if (filterDate) {
            // Check if company has data for this specific date
            const hasDataForDate = data.entries.some(entry =>
                (entry.DATES || entry.dates || entry.Date || '').trim() === filterDate
            );
            if (hasDataForDate) {
                companiesToShow.push(company);
            }
        } else {
            // Show all companies with any data
            companiesToShow.push(company);
        }
    });

    if (companiesToShow.length === 0) {
        grid.innerHTML = '<div class="loading">No companies found for selected date</div>';
        return;
    }

    grid.innerHTML = companiesToShow.map(company => {
        const symbol = company.name || '';
        const name = company.company_name || symbol;
        const data = companyDataMap.get(symbol);

        let badges = '';
        let totalCount = 0;

        if (data) {
            const announcements = filterDate
                ? data.announcements.filter(e => (e.DATES || e.dates || e.Date || '').trim() === filterDate)
                : data.announcements;

            const twitter = filterDate
                ? data.twitter.filter(e => (e.DATES || e.dates || e.Date || '').trim() === filterDate)
                : data.twitter;

            // Count unique summaries for Twitter (not total tweets)
            const uniqueSummaries = new Set();
            twitter.forEach(entry => {
                const date = (entry.DATES || entry.dates || entry.Date || '').trim();
                let summary = (entry.SUMMARY || entry.summary || '').trim();
                summary = summary.replace(/^"/, '').replace(/"$/, '');
                const lines = summary.split('\n');
                if (lines.length > 0 && lines[0].match(/^Sources?:/i)) {
                    lines.shift();
                }
                summary = lines.join('\n').trim();
                const key = `${date}-${summary}`;
                uniqueSummaries.add(key);
            });

            const uniqueTwitterCount = uniqueSummaries.size;

            totalCount = announcements.length + uniqueTwitterCount;

            if (announcements.length > 0) {
                badges += `<span class="badge badge-announcement">📢 ${announcements.length}</span>`;
            }

            if (uniqueTwitterCount > 0) {
                badges += `<span class="badge badge-twitter">🐦 ${uniqueTwitterCount}</span>`;
            }

            if (totalCount > 0) {
                badges += `<span class="badge badge-count">${totalCount}</span>`;
            }
        }

        return `
            <div class="company-card" data-symbol="${symbol}">
                <div class="company-symbol">${symbol}</div>
                <div class="company-name">${name}</div>
                ${badges ? `<div class="company-badges">${badges}</div>` : ''}
            </div>
        `;
    }).join('');
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    document.getElementById('calendar').addEventListener('click', (e) => {
        const dayCell = e.target.closest('.calendar-day');
        if (!dayCell || dayCell.classList.contains('empty')) return;

        const date = dayCell.dataset.date;
        if (!date) return;

        if (selectedDate === date) {
            selectedDate = null;
        } else {
            selectedDate = date;
        }

        updateStats();
        renderCalendar();
        renderCompanies(selectedDate, searchQuery);
    });

    document.getElementById('calendar').addEventListener('click', (e) => {
        if (e.target.id === 'prevMonth') {
            currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
            renderCalendar();
        } else if (e.target.id === 'nextMonth') {
            currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
            renderCalendar();
        }
    });

    document.getElementById('resetFilter').addEventListener('click', () => {
        selectedDate = null;
        searchQuery = '';
        document.getElementById('searchInput').value = '';
        updateStats();
        renderCalendar();
        renderCompanies();
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCompanies(selectedDate, searchQuery);
    });

    document.getElementById('companiesGrid').addEventListener('click', (e) => {
        const card = e.target.closest('.company-card');
        if (!card) return;

        const symbol = card.dataset.symbol;
        showCompanyModal(symbol);
    });

    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', closeModal);
}

// ===== Show Company Modal (Step 1: Show Category Cards) =====
function showCompanyModal(symbol) {
    const data = companyDataMap.get(symbol);
    const company = holdingCompanies.find(c => c.name === symbol);

    if (!company) return;

    const modal = document.getElementById('companyModal');
    const modalTitle = document.getElementById('modalCompanyName');
    const categoryCards = document.getElementById('categoryCards');
    const detailView = document.getElementById('detailView');
    const noDataMessage = document.getElementById('noDataMessage');

    modalTitle.textContent = company.company_name || symbol;
    currentCompanyData = data;
    currentView = 'categories';

    if (!data) {
        categoryCards.style.display = 'none';
        detailView.style.display = 'none';
        noDataMessage.style.display = 'block';
        modal.classList.add('active');
        return;
    }

    let announcements = data.announcements;
    let twitter = data.twitter;

    if (selectedDate) {
        announcements = announcements.filter(e =>
            (e.DATES || e.dates || e.Date || '').trim() === selectedDate
        );
        twitter = twitter.filter(e =>
            (e.DATES || e.dates || e.Date || '').trim() === selectedDate
        );
    }

    let cardsHTML = '';

    if (announcements.length > 0) {
        cardsHTML += `
            <div class="category-card announcement" data-category="announcements">
                <div class="category-icon">📢</div>
                <div class="category-title">Announcements</div>
                <div class="category-count">${announcements.length} ${announcements.length === 1 ? 'item' : 'items'}</div>
            </div>
        `;
    }

    if (twitter.length > 0) {
        // Count unique summaries
        const uniqueSummaries = new Set();
        twitter.forEach(entry => {
            const date = (entry.DATES || entry.dates || entry.Date || '').trim();
            let summary = (entry.SUMMARY || entry.summary || '').trim();
            summary = summary.replace(/^"/, '').replace(/"$/, '');
            const lines = summary.split('\n');
            if (lines.length > 0 && lines[0].match(/^Sources?:/i)) {
                lines.shift();
            }
            summary = lines.join('\n').trim();
            const key = `${date}-${summary}`;
            uniqueSummaries.add(key);
        });

        const uniqueCount = uniqueSummaries.size;

        cardsHTML += `
            <div class="category-card twitter" data-category="twitter">
                <div class="category-icon">🐦</div>
                <div class="category-title">Twitter Updates</div>
                <div class="category-count">${uniqueCount} ${uniqueCount === 1 ? 'tweet' : 'tweets'}</div>
            </div>
        `;
    }

    if (cardsHTML) {
        categoryCards.innerHTML = cardsHTML;
        categoryCards.style.display = 'grid';
        detailView.style.display = 'none';
        noDataMessage.style.display = 'none';

        // Add click listeners to category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                showCategoryDetails(category);
            });
        });
    } else {
        categoryCards.style.display = 'none';
        detailView.style.display = 'none';
        noDataMessage.style.display = 'block';
    }

    modal.classList.add('active');
}

// ===== Show Category Details (Step 2: Show Details) =====
function showCategoryDetails(category) {
    const categoryCards = document.getElementById('categoryCards');
    const detailView = document.getElementById('detailView');
    const detailContent = document.getElementById('detailContent');

    currentView = 'details';
    currentCategory = category;

    categoryCards.style.display = 'none';
    detailView.style.display = 'block';

    let items = category === 'announcements' ? currentCompanyData.announcements : currentCompanyData.twitter;

    if (selectedDate) {
        items = items.filter(e =>
            (e.DATES || e.dates || e.Date || '').trim() === selectedDate
        );
    }

    // For Twitter, group by summary to show all sources
    if (category === 'twitter') {
        const summaryGroups = new Map();

        items.forEach(entry => {
            const date = (entry.DATES || entry.dates || entry.Date || '').trim();
            let summary = (entry.SUMMARY || entry.summary || '').trim();

            // Clean summary
            summary = summary.replace(/^"/, '').replace(/"$/, '');
            const lines = summary.split('\n');
            if (lines.length > 0 && lines[0].match(/^Sources?:/i)) {
                lines.shift();
            }
            summary = lines.join('\n').trim();

            const key = `${date}-${summary}`;

            if (!summaryGroups.has(key)) {
                summaryGroups.set(key, {
                    date: date,
                    summary: summary,
                    sources: []
                });
            }

            summaryGroups.get(key).sources.push({
                tweetUrl: entry['TWEET_URL'] || entry.TWEET_URL || '',
                sourceLinks: entry['SOURCE_LINK'] || entry.SOURCE_LINK || '',
                channelName: entry['CHANNEL_NAME'] || entry.CHANNEL_NAME || ''
            });
        });

        // Display grouped summaries with all sources
        let detailsHTML = '';

        summaryGroups.forEach(group => {
            const summary = group.summary.replace(/\n/g, '<br>') || 'No summary available';

            detailsHTML += `
                <div class="detail-item twitter-item">
                    <div class="detail-date">${formatDate(group.date)}</div>
                    <div class="detail-summary">${summary}</div>
            `;

            // Add all sources for this summary
            group.sources.forEach((source, index) => {
                const channelName = source.channelName.trim();
                const tweetUrl = source.tweetUrl.trim();
                const sourceLinks = source.sourceLinks.trim();

                console.log('🔍 Source #' + (index + 1) + ':', { channelName, tweetUrl, sourceLinks });

                detailsHTML += `
                    <div class="tweet-source-group" style="margin-top: ${index === 0 ? '1rem' : '0.75rem'}; padding: 0.75rem; background: rgba(59, 130, 246, 0.05); border-radius: 0.5rem; border-left: 3px solid var(--secondary-color);">
                        ${channelName ? `<div class="detail-meta" style="margin-bottom: 0.5rem;">Channel: ${channelName}</div>` : ''}
                        <div class="detail-links">
                            ${tweetUrl ? `<a href="${tweetUrl}" target="_blank" class="detail-link">🐦 View Tweet</a>` : ''}
                            ${sourceLinks ? sourceLinks.split('\n').filter(link => link.trim()).map(link => {
                    const cleanLink = link.trim().replace(/^-/, '').trim();
                    console.log('🔗 Link:', cleanLink);
                    if (cleanLink && cleanLink.startsWith('http')) {
                        return `<a href="${cleanLink}" target="_blank" class="detail-link">🔗 Source Link</a>`;
                    }
                    return '';
                }).join('') : ''}
                        </div>
                    </div>
                `;
            });

            detailsHTML += `</div>`;
        });

        detailContent.innerHTML = detailsHTML;
        return;
    }

    let detailsHTML = '';

    items.forEach(entry => {
        console.log('📝 Processing entry:', entry);

        // Get raw summary
        let summary = (entry.SUMMARY || entry.summary || '').trim();
        console.log('Raw summary:', summary);

        if (!summary) {
            summary = 'No summary available';
        } else {
            // Remove quotes first
            summary = summary.replace(/^"/, '').replace(/"$/, '');

            // Split into lines
            const lines = summary.split('\n');
            console.log('Summary lines:', lines.length);

            // If first line starts with "Sources:", remove it
            if (lines.length > 0 && lines[0].match(/^Sources?:/i)) {
                console.log('Removing Sources line:', lines[0]);
                lines.shift(); // Remove first line
            }

            // Join remaining lines and clean
            summary = lines.join('\n').trim();

            // Convert newlines to <br> for HTML display
            summary = summary.replace(/\n/g, '<br>');

            // If still empty after cleaning
            if (!summary) {
                summary = 'No summary available';
            }
        }

        console.log('Final summary:', summary);

        const date = entry.DATES || entry.dates || entry.Date || '';

        if (category === 'announcements') {
            const sourceLink = (entry.SOURCE_LINK || entry.source_link || '').trim();

            detailsHTML += `
                <div class="detail-item announcement-item">
                    <div class="detail-date">📅 ${formatDate(date)}</div>
                    <div class="detail-summary">${summary}</div>
                    ${sourceLink ? `
                        <div class="detail-links">
                            <a href="${sourceLink}" target="_blank" class="detail-link">📄 View Announcement</a>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            const channelName = (entry.CHANNEL_NAME || entry.channel_name || '').trim();
            const tweetUrl = (entry.TWEET_URL || entry.tweet_url || '').trim();
            const sourceLinks = (entry.SOURCE_LINK || entry.source_link || '').trim();
            const links = sourceLinks.split('\n').filter(link => link.trim());

            detailsHTML += `
                <div class="detail-item twitter-item">
                    <div class="detail-date">${formatDate(date)}</div>
                    <div class="detail-summary">${summary}</div>
                    ${channelName ? `
                        <div class="detail-meta">
                            <div class="meta-item">
                                <span class="meta-label">Channel:</span>
                                <span class="meta-value">${channelName}</span>
                            </div>
                        </div>
                    ` : ''}
                    <div class="detail-links">
                        ${tweetUrl ? `<a href="${tweetUrl}" target="_blank" class="detail-link">🐦 View Tweet</a>` : ''}
                        ${links.map(link => {
                const cleanLink = link.replace(/^-/, '').trim();
                if (cleanLink && cleanLink.startsWith('http')) {
                    return `<a href="${cleanLink}" target="_blank" class="detail-link">🔗 Source Link</a>`;
                }
                return '';
            }).join('')}
                    </div>
                </div>
            `;
        }
    });

    detailContent.innerHTML = detailsHTML;

    // Setup back button
    document.getElementById('btnBack').onclick = () => {
        categoryCards.style.display = 'grid';
        detailView.style.display = 'none';
        currentView = 'categories';
    };
}

// ===== Close Modal =====
function closeModal() {
    document.getElementById('companyModal').classList.remove('active');
    currentView = 'categories';
    currentCategory = null;
    currentCompanyData = null;
    searchQuery = '';
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (currentView === 'details') {
            document.getElementById('categoryCards').style.display = 'grid';
            document.getElementById('detailView').style.display = 'none';
            currentView = 'categories';
        } else {
            closeModal();
        }
    }
});
