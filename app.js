// VERSION: 2.0.1 - Diamond symbol cleaning fix
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

// ===== Company Logo Domains =====
// Complete mapping for all 122+ companies to their website domains
const companyDomains = {
    // A
    '3MINDIA': '3m.com',
    'ABBOTINDIA': 'abbott.com',
    'AGOL': 'ashapurigold.com',
    'ALIVUS': 'alivus.com',
    'AMBER': 'ambergroupindia.com',
    'APOLLOHOSP': 'apollohospitals.com',
    'ARE&M': 'amararajabatteries.com',
    'ASIANPAINT': 'asianpaints.com',
    'ASTRAMICRO': 'astramwp.com',
    'AUROPHARMA': 'aurobindo.com',
    'AUTOBEES': 'nipponindiaim.com',
    'AXISBANK': 'axisbank.com',
    // B
    'BAJFINANCE': 'bajajfinserv.in',
    'BALKRISIND': 'bkt-tires.com',
    'BBL': 'bharatbijlee.com',
    'BDL': 'bdl-india.com',
    'BEL': 'bharatelectronics.com',
    'BHARATFORG': 'bharatforge.com',
    'BHEL': 'bhel.com',
    'BIOCON': 'biocon.com',
    // C
    'CAPLIPOINT': 'caplinpoint.net',
    'CDSL': 'cdslindia.com',
    'CIPLA': 'cipla.com',
    'COFORGE': 'coforge.com',
    'COMPEAU': 'competent-maruti.com',
    'CUMMINSIND': 'cumminsindia.com',
    // D
    'DECNGOLD': 'deccangoldmines.com',
    'DEN': 'dennetworks.com',
    'DRREDDY': 'drreddys.com',
    'DYNAMATECH': 'dynamatics.com',
    // E
    'EMBASSY': 'embassyofficeparks.com',
    'ESCORTS': 'escortskubota.com',
    'ETERNAL': 'eternal.com',
    // G
    'GMMPFAUDLR': 'gmmpfaudler.com',
    'GMRAIRPORT': 'gmrgroup.in',
    'GODREJCP': 'godrejcp.com',
    'GOLD1': 'kotakmf.com',
    'GOLDIETF': 'icicipruamc.com',
    'GRASIM': 'grasim.com',
    'GULFOILLUB': 'gulfoilindia.com',
    // H
    'HAL': 'hal-india.com',
    'HCLTECH': 'hcltech.com',
    'HDFCBANK': 'hdfcbank.com',
    'HGINFRA': 'hginfra.com',
    'HINDUNILVR': 'hul.co.in',
    // I
    'ICICIBANK': 'icicibank.com',
    'ICICIGI': 'icicilombard.com',
    'ICICIPRULI': 'iciciprulife.com',
    'IEX': 'iexindia.com',
    'INDHOTEL': 'tajhotels.com',
    'INTERARCH': 'interarchbuildings.com',
    'IOC': 'iocl.com',
    'ITC': 'itcportal.com',
    'ITCHOTELS': 'itchotels.com',
    // J
    'JAMNAAUTO': 'jspring.com',
    'JAYBARMARU': 'jbmgroup.com',
    'JIOFIN': 'jfs.in',
    'JUNIORBEES': 'nipponindiaim.com',
    // K
    'KAYNES': 'kaynestechnology.co.in',
    'KEI': 'kei-ind.com',
    'KICL': 'kalyanigroup.com',
    'KIRLOSENG': 'kirloskaroilengines.com',
    'KOTAKBANK': 'kotak.com',
    'KPIGREEN': 'kpigreenenergy.com',
    'KRT': 'knowledgerealtytrust.com',
    // L
    'LT': 'larsentoubro.com',
    'LTFOODS': 'ltfoods.com',
    'LAURUSLABS': 'lauruslabs.com',
    // M
    'MACPLASQ': 'machino.com',
    'MANKIND': 'mankindpharma.com',
    'MAPMYINDIA': 'mapmyindia.com',
    'MARICO': 'marico.com',
    'MARUTI': 'marutisuzuki.com',
    'MAZDOCK': 'mazagondock.in',
    'MINDACORP': 'sparkminda.com',
    'MINDSPACE': 'mindspaceindia.com',
    'MOSMALL250': 'motilaloswalmf.com',
    'MSUMI': 'motherson.com',
    'MYSORPETRO': 'mysorepetro.com',
    // N
    'NATIONALUM': 'nalcoindia.com',
    'NESTLEIND': 'nestle.in',
    'NEULANDLAB': 'neulandlabs.com',
    'NH': 'narayanahealth.org',
    'NIFTYBEES': 'nipponindiaim.com',
    'NSIL': 'nalwasons.com',
    // P
    'PGINVIT': 'pginvit.in',
    'PIDILITIND': 'pidilite.com',
    'PILANIINVS': 'birlagroup.com',
    'PRAJIND': 'praj.net',
    // R
    'RBLBANK': 'rblbank.com',
    'RELIANCE': 'ril.com',
    // S
    'SBIN': 'sbi.co.in',
    'SCHAEFFLER': 'schaeffler.co.in',
    'SCILAL': 'scilal.com',
    'SHOPERSTOP': 'shoppersstop.com',
    'SIEMENS': 'siemens.com',
    'SILVERBEES': 'nipponindiaim.com',
    'SILVERIETF': 'icicipruamc.com',
    'SONACOMS': 'sonacomstar.com',
    'STYLAMIND': 'stylam.com',
    'SUNPHARMA': 'sunpharma.com',
    'SYNGENE': 'syngeneintl.com',
    // T
    'TATACOMM': 'tatacommunications.com',
    'TATACONSUM': 'tataconsumer.com',
    'TATAELXSI': 'tataelxsi.com',
    'TATAPOWER': 'tatapower.com',
    'TCI': 'tciexpress.in',
    'TCS': 'tcs.com',
    'TIMKEN': 'timken.com',
    'TINNARUBR': 'tinna.in',
    'TITAN': 'titancompany.in',
    'TMCV': 'tatamotors.com',
    'TMPV': 'tatamotors.com',
    'TRENT': 'trentlimited.com',
    // U
    'ULTRACEMCO': 'ultratechcement.com',
    'UNITDSPR': 'diageo.com',
    'UNIVCABLES': 'unistar.co.in',
    // V
    'VBL': 'varunbeverages.com',
    'VEDL': 'vedantalimited.com',
    // W
    'WELCORP': 'welspuncorp.com',
    'WPIL': 'wpil.co.in',
    // Z
    'ZYDUSLIFE': 'zyduslife.com'
};

// Dynamic domain generator for companies not in the mapping
// This will automatically try to find logos for any new company
function generateDomainFromName(companyName) {
    if (!companyName) return null;

    // Common suffixes to remove
    const suffixes = /\s*(ltd\.?|limited|pvt\.?|private|co\.?|company|inc\.?|corp\.?|corporation|industries?|enterprises?|india|etf|reit|bees|invit)\s*/gi;

    // Clean the company name
    let cleanName = companyName.toLowerCase()
        .replace(suffixes, ' ')
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 2) // Remove small words
        .slice(0, 2) // Take first 2 words
        .join('');

    if (cleanName.length > 0) {
        // Return .com domain for most companies
        return cleanName + '.com';
    }
    return null;
}

// Function to get company logo URL - uses multiple fallback sources
function getCompanyLogoUrl(symbol, companyName) {
    const trimmedSymbol = symbol.trim();

    // Special cases for companies where Clearbit doesn't have correct logos
    if (trimmedSymbol === 'BEL') {
        return 'https://static.cdnlogo.com/logos/b/54/bharat-electronics.svg';
    }

    let domain = companyDomains[trimmedSymbol];

    // If not in mapping, try to generate from company name
    if (!domain && companyName) {
        domain = generateDomainFromName(companyName);
    }

    if (domain) {
        // Primary: Clearbit Logo API (free, good quality)
        return `https://logo.clearbit.com/${domain}`;
    }
    return null;
}

// Alternative logo URL (fallback)
function getAlternativeLogoUrl(symbol, companyName) {
    const trimmedSymbol = symbol.trim();
    let domain = companyDomains[trimmedSymbol];

    // If not in mapping, try to generate from company name
    if (!domain && companyName) {
        domain = generateDomainFromName(companyName);
    }

    if (domain) {
        // Fallback: Logo.dev API
        return `https://img.logo.dev/${domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ`;
    }
    return null;
}

// Function to generate initials fallback
function getCompanyInitials(name) {
    const words = name.split(' ').filter(w => w.length > 0);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Dashboard...');
    await loadData();
    // renderCalendar(); // Removed - calendar no longer in UI
    renderCompanies();
    setupEventListeners();
    setupScrollOptimizations();
});

// ===== Scroll Performance Optimizations =====
function setupScrollOptimizations() {
    // Use passive listeners for scroll events
    document.addEventListener('scroll', () => { }, { passive: true });

    // Add passive listeners to any scrollable containers
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.addEventListener('scroll', () => { }, { passive: true });
    }
}

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
    const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/\r/g, ''));

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
            // Clean all values by removing carriage returns and trimming
            row[header] = values[index] ? values[index].trim().replace(/\r/g, '') : '';
        });

        data.push(row);
        i++;
    }

    return data;
}

// ===== Normalize Company Name for Matching =====
function normalizeCompanyName(name) {
    if (!name) return '';

    return name
        .toLowerCase()                          // Convert to lowercase
        .replace(/[.,\-_()]/g, '')             // Remove punctuation: . , - _ ( )
        .replace(/\s+/g, '')                   // Remove ALL spaces (handles compound words)
        .trim();                                // Remove leading/trailing spaces
}

// ===== Special Company Name Mappings =====
// Handle known mismatches between CSV and holding companies
const companyAliases = {
    'tatamotors': ['tmpv', 'tatamotorsltd'],
    'tmpv': ['tatamotors', 'tatamotorsltd']
};

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

    availableDates = Array.from(datesSet).sort((a, b) => {
        const da = parseDate(a);
        const db = parseDate(b);
        if (!da || !db) return 0;
        return db - da; // Latest to oldest
    });
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

        // Normalize holding company identifiers
        const normalizedSymbol = normalizeCompanyName(companySymbol);
        const normalizedName = normalizeCompanyName(companyName);

        const companyEntries = announcementsData.filter(entry => {
            const entryCompany = (entry.Company || entry.company || '').trim();
            const normalizedEntry = normalizeCompanyName(entryCompany);

            // Direct match by normalized symbol or normalized company name
            if (normalizedEntry === normalizedSymbol || normalizedEntry === normalizedName) {
                return true;
            }

            // Check aliases
            const entryAliases = companyAliases[normalizedEntry] || [];
            const symbolAliases = companyAliases[normalizedSymbol] || [];
            const nameAliases = companyAliases[normalizedName] || [];

            // Check if entry is an alias of symbol or name
            if (entryAliases.includes(normalizedSymbol) || entryAliases.includes(normalizedName)) {
                return true;
            }

            // Check if symbol or name is an alias of entry
            if (symbolAliases.includes(normalizedEntry) || nameAliases.includes(normalizedEntry)) {
                return true;
            }

            return false;
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

    // Try DD/MM/YYYY format first (e.g., "22/12/2025")
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const year = parseInt(parts[2]);

            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                return new Date(year, month, day);
            }
        }
    }

    // Try YYYY-MM-DD format (e.g., "2025-12-22")
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
    // document.getElementById('selectedDate').textContent = selectedDate ? formatDate(selectedDate) : 'All Dates'; // Removed - element no longer exists
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
        // Create date strings in both formats for matching
        const dateStrYMD = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateStrDMY = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;

        // Check for data in either format
        const hasData = availableDates.includes(dateStrYMD) || availableDates.includes(dateStrDMY);
        const count = dateCounts[dateStrYMD] || dateCounts[dateStrDMY] || 0;

        // Use the format that exists in availableDates for selection
        const actualDateStr = availableDates.includes(dateStrDMY) ? dateStrDMY : dateStrYMD;
        const isSelected = selectedDate === dateStrYMD || selectedDate === dateStrDMY;

        calendarHTML += `
            <div class="calendar-day ${hasData ? 'has-data' : ''} ${isSelected ? 'selected' : ''}" 
                 data-date="${actualDateStr}">
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

    // Sort companies alphabetically by company name (A-Z)
    companiesToShow.sort((a, b) => {
        const nameA = (a.company_name || a.name || '').toLowerCase();
        const nameB = (b.company_name || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });

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

                // Skip if summary is empty after cleaning
                if (!summary) return;

                const key = `${date}-${summary}`;
                uniqueSummaries.add(key);
            });

            const uniqueTwitterCount = uniqueSummaries.size;

            totalCount = announcements.length + uniqueTwitterCount;

            if (announcements.length > 0) {
                badges += `<span class="badge badge-announcement"> ${announcements.length}</span>`;
            }

            if (uniqueTwitterCount > 0) {
                badges += `<span class="badge badge-twitter"> ${uniqueTwitterCount}</span>`;
            }

            if (totalCount > 0) {
                badges += `<span class="badge badge-count">${totalCount}</span>`;
            }
        }

        // Get logo URL or generate initials fallback
        const logoUrl = getCompanyLogoUrl(symbol, name);
        const altLogoUrl = getAlternativeLogoUrl(symbol, name);
        const initials = getCompanyInitials(name);

        const logoHtml = logoUrl
            ? `<div class="company-logo">
                <img src="${logoUrl}" alt="${symbol}" onerror="this.onerror=null; if('${altLogoUrl}' !== 'null') { this.src='${altLogoUrl}'; } else { this.style.display='none'; this.nextElementSibling.style.display='flex'; }">
                <div class="company-initials" style="display:none;">${initials}</div>
               </div>`
            : `<div class="company-logo"><div class="company-initials">${initials}</div></div>`;

        return `
            <div class="company-card" data-symbol="${symbol}">
                ${logoHtml}
                <div class="company-info">
                    <div class="company-symbol">${symbol}</div>
                    <div class="company-name">${name}</div>
                    ${badges ? `<div class="company-badges">${badges}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    // Calendar event listeners removed - calendar no longer in UI

    document.getElementById('resetFilter').addEventListener('click', () => {
        selectedDate = null;
        searchQuery = '';
        document.getElementById('searchInput').value = '';
        updateStats();
        // renderCalendar(); // Removed
        renderCompanies();
    });

    // Search input with debouncing for better performance
    let searchTimeout = null;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value;

        // Debounce search to prevent excessive re-renders
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
                renderCompanies(selectedDate, searchQuery);
            });
        }, 150); // 150ms delay for smoother typing
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
                <div class="category-icon"></div>
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

            // Skip if summary is empty after cleaning
            if (!summary) return;

            const key = `${date}-${summary}`;
            uniqueSummaries.add(key);
        });

        const uniqueCount = uniqueSummaries.size;

        cardsHTML += `
            <div class="category-card twitter" data-category="twitter">
                <div class="category-icon"></div>
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

    // Sort items by date (newest to oldest - latest first)
    items = items.sort((a, b) => {
        const dateA = parseDate((a.DATES || a.dates || a.Date || '').trim());
        const dateB = parseDate((b.DATES || b.dates || b.Date || '').trim());

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return dateB - dateA; // Descending order (latest first)
    });

    // For Twitter, group by summary to show all sources
    if (category === 'twitter') {
        const summaryGroups = new Map();

        items.forEach(entry => {
            const date = (entry.DATES || entry.dates || entry.Date || '').trim();
            let summary = (entry.SUMMARY || entry.summary || '').trim();

            // Clean summary
            summary = summary.replace(/^"/, '').replace(/"$/, '');
            const lines = summary.split('\n');
            // Remove "RELEVANT (confidence)" line if it exists
            if (lines.length > 0 && lines[0].trim().match(/^RELEVANT\s*\(.*?\)/i)) {
                lines.shift();
            }
            // Remove "Sources:" line if it exists at the top
            if (lines.length > 0 && lines[0].trim().match(/^Sources?:/i)) {
                lines.shift();
            }
            summary = lines.join('\n').trim();

            // Group by summary ONLY (not date+summary)
            // Skip if summary is empty after cleaning
            if (!summary) return;

            const key = summary;

            if (!summaryGroups.has(key)) {
                summaryGroups.set(key, {
                    dates: new Set(), // Store all unique dates
                    summary: summary,
                    sources: []
                });
            }

            // Add date to the set
            summaryGroups.get(key).dates.add(date);

            summaryGroups.get(key).sources.push({
                date: date, // Store date with each source
                tweetUrl: entry['TWEET_URL'] || entry.TWEET_URL || '',
                sourceLinks: entry['SOURCE_LINK'] || entry.SOURCE_LINK || '',
                channelName: entry['CHANNEL_NAME'] || entry.CHANNEL_NAME || ''
            });
        });

        // Display grouped summaries with all sources
        let detailsHTML = '';

        summaryGroups.forEach(group => {
            const summary = group.summary.replace(/\n/g, '<br>') || '';

            // Format all dates and sort them
            const sortedDates = Array.from(group.dates).sort((a, b) => {
                const da = parseDate(a);
                const db = parseDate(b);
                return db - da;
            });
            // Remove duplicate formatted dates (e.g., if "13/01/2026" appears twice)
            const uniqueFormattedDates = [...new Set(sortedDates.map(d => formatDate(d)))];
            const allDates = uniqueFormattedDates.join(', ');

            detailsHTML += `
                <div class="detail-item twitter-item">
                    <div class="detail-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${allDates}</div>
                    <div class="detail-summary">${summary}</div>
            `;

            // Add all sources for this summary
            group.sources.forEach((source, index) => {
                const channelName = source.channelName.trim();
                const tweetUrl = source.tweetUrl.trim();
                const sourceLinks = source.sourceLinks.trim();
                const sourceDate = formatDate(source.date);

                console.log('🔍 Source #' + (index + 1) + ':', { channelName, tweetUrl, sourceLinks, date: sourceDate });

                detailsHTML += `
                    <div class="tweet-source-group" style="margin-top: ${index === 0 ? '1rem' : '0.75rem'}; padding: 0.75rem; background: rgba(59, 130, 246, 0.05); border-radius: 0.5rem; border-left: 3px solid var(--secondary-color);">
                        <div class="detail-meta" style="margin-bottom: 0.5rem;">
                            ${channelName ? `<span>Channel: ${channelName}</span>` : ''}
                        </div>
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
            summary = '';
        } else {
            // Remove quotes first
            summary = summary.replace(/^"/, '').replace(/"$/, '');

            // Remove header lines (RELEVANT, Sources)
            const lines = summary.split('\n').map(l => l.trim());
            while (lines.length > 0 && (lines[0].match(/^RELEVANT\s*\(.*?\)/i) || lines[0].match(/^Sources?:/i) || !lines[0])) {
                lines.shift();
            }
            summary = lines.join('\n').trim();

            // ===== STEP 1: Clean ALL unwanted characters FIRST =====

            // Clean UTF-8 encoding artifacts
            summary = summary.replace(/[ÃâÂ]+[€¢Â]*/g, '');
            summary = summary.replace(/€/g, '');
            summary = summary.replace(/Â/g, '');

            // Remove ALL Unicode box and geometric shape characters
            summary = summary.replace(/[\u2500-\u257F]/g, ''); // Box Drawing
            summary = summary.replace(/[\u2580-\u259F]/g, ''); // Block Elements
            summary = summary.replace(/[\u25A0-\u25FF]/g, ''); // Geometric Shapes
            summary = summary.replace(/[\u2600-\u26FF]/g, ''); // Miscellaneous Symbols
            summary = summary.replace(/[\u2700-\u27BF]/g, ''); // Dingbats
            summary = summary.replace(/[\u2610-\u2612]/g, ''); // Ballot boxes
            summary = summary.replace(/[\u2B1A-\u2B1C]/g, ''); // More squares

            // Additional specific box characters
            summary = summary.replace(/\u25A1/g, ''); // White square
            summary = summary.replace(/\u25A0/g, ''); // Black square
            summary = summary.replace(/\u25AB/g, ''); // White small square
            summary = summary.replace(/\u25AA/g, ''); // Black small square
            summary = summary.replace(/\u25FB/g, ''); // White medium square
            summary = summary.replace(/\u25FC/g, ''); // Black medium square
            summary = summary.replace(/\u25FD/g, ''); // White medium small square
            summary = summary.replace(/\u25FE/g, ''); // Black medium small square

            // Explicitly remove diamond symbols AND the replacement character �
            // The CSV diamond symbols (◆) are converted to � (U+FFFD) by the browser
            summary = summary.replace(/[◆◇♦♢�]/g, '');
            summary = summary.replace(/\ufffd/g, ''); // Double-check removal

            // Remove control characters and zero-width characters
            summary = summary.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
            summary = summary.replace(/[\u200B-\u200D\uFEFF]/g, '');

            // Remove markdown headers (### anywhere in text, not just at line start)
            summary = summary.replace(/#+/g, '');

            // Remove ALL asterisks (both single * and double **)
            summary = summary.replace(/\*/g, '');

            // Remove colons that appear after common header words
            summary = summary.replace(/^(Announcement Type|Key Insights|Approval Details|Significance|Key Dates|Parties Involved|Bottom Line|Conclusion|Summary|Key Points):\s*/gmi, '$1 ');

            // ===== STEP 2: Process lines and add clean bullets =====

            // First, split on existing bullet points (•) to separate items
            // This handles cases where all bullets are on one line
            let parts = summary.split(/•+/);

            // Also split on diamond symbols (◆) and the replacement character �
            let diamondParts = [];
            parts.forEach(part => {
                // Split on ◆ ◇ ♦ ♢ � and similar diamond/geometric markers
                diamondParts.push(...part.split(/[◆◇♦♢�\ufffd]/));
            });

            // Also split on numbered lists (1. 2. 3. etc.)
            let numberedParts = [];
            diamondParts.forEach(part => {
                // Split on patterns like "1. " or "2. " or "10. "
                numberedParts.push(...part.split(/\s+\d+\.\s+/));
            });

            // Process newlines - only split if line starts with bullet-like pattern
            // Otherwise join continuation lines together
            let allParts = [];
            numberedParts.forEach(part => {
                const lines = part.split('\n');
                let currentPart = '';

                lines.forEach((line, idx) => {
                    const trimmedLine = line.trim();

                    // Check if this line starts a new bullet point
                    const startsWithBullet = /^[•·∙▪▫◦⦿⦾○●◉◎⊙⊚⊛⊜☉♦♢▸►▹‣⁃−–—\-]\s*/.test(trimmedLine);
                    const startsWithNumber = /^\d+\.\s+/.test(trimmedLine);
                    const isNewPoint = startsWithBullet || startsWithNumber;

                    if (idx === 0) {
                        // First line always starts a new part
                        currentPart = trimmedLine;
                    } else if (isNewPoint) {
                        // This line starts a new bullet - save current and start new
                        if (currentPart) allParts.push(currentPart);
                        currentPart = trimmedLine;
                    } else if (trimmedLine) {
                        // Continuation line - join with space
                        currentPart = currentPart ? currentPart + ' ' + trimmedLine : trimmedLine;
                    }
                });

                // Don't forget the last part
                if (currentPart) allParts.push(currentPart);
            });


            // Clean each part
            const cleanedLines = allParts.map(line => {
                line = line.trim();

                // Skip empty lines
                if (!line) return '';

                // Remove "Sources:" prefix if present
                if (line.match(/^Sources?:/i)) return '';

                // Remove "Key Points:" prefix if it's standalone
                if (line.match(/^Key Points?:?\s*$/i)) return '';

                // Remove ALL existing bullets/markers at start
                line = line.replace(/^[•·∙▪▫◦⦿⦾○●◉◎⊙⊚⊛⊜☉♦♢▸►▹‣⁃−–—\s]+/, '');

                // Remove numbered list markers at the start (1., 2., etc.)
                line = line.replace(/^\d+\.\s*/, '');

                // Remove hyphen bullets
                line = line.replace(/^[-]\s+/, '');

                // Trim again after removing bullets
                line = line.trim();

                // Skip if line is now empty or too short
                if (!line || line.length < 3) return '';

                // Only add single bullet if line has content
                return '• ' + line;
            }).filter(line => line); // Remove empty lines

            // Join lines with proper spacing
            summary = cleanedLines.join('\n').trim();

            // Convert newlines to <br> for HTML display
            summary = summary.replace(/\n/g, '<br>');

            if (!summary) {
                summary = '';
            }
        }

        console.log('Final summary:', summary);

        const date = entry.DATES || entry.dates || entry.Date || '';

        if (category === 'announcements') {
            const sourceLink = (entry.SOURCE_LINK || entry.source_link || '').trim();

            detailsHTML += `
                <div class="detail-item announcement-item">
                    <div class="detail-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${formatDate(date)}</div>
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
                    <div class="detail-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${formatDate(date)}</div>
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
                        ${tweetUrl ? `<a href="${tweetUrl}" target="_blank" class="detail-link"> View Tweet</a>` : ''}
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
