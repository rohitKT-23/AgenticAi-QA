// ===================================
// AGENTIC TEST GENERATOR - CLIENT APP
// ===================================

// ===== THEME TOGGLE FUNCTIONALITY =====
// Get theme from localStorage or default to dark
const getTheme = () => localStorage.getItem('theme') || 'dark';
const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleTooltip(theme);
};

// Update tooltip text based on current theme
const updateThemeToggleTooltip = (theme) => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.setAttribute(
            'data-tooltip', 
            theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
        );
    }
};

// Initialize theme on page load
document.documentElement.setAttribute('data-theme', getTheme());

// Theme toggle button event listener
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Set initial tooltip
        updateThemeToggleTooltip(getTheme());
        
        // Toggle theme on click
        themeToggle.addEventListener('click', () => {
            const currentTheme = getTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            
            // Add a little animation feedback
            themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }
});

// State management
let currentTestCases = [];
let currentResult = null;

// Example templates
const examples = {
    login: `Users can log in using email and password. 
- Email must be valid format
- Password must be at least 8 characters
- Account locks after 5 failed attempts
- Session expires after 30 minutes of inactivity`,
    
    upload: `Users can upload files up to 10MB. 
- Supported formats: PDF, JPG, PNG, DOCX
- Users must be authenticated
- Files are scanned for viruses
- Upload progress is shown`,
    
    payment: `Users can process payments using credit card.
- Supports Visa, Mastercard, Amex
- Card validation required
- 3D Secure authentication
- Transaction amount between $1 and $10,000
- Receipt sent via email`,
    
    api: `REST API endpoint for user registration.
- POST /api/users
- Required fields: email, password, name
- Email must be unique
- Password must meet complexity requirements
- Returns 201 on success, 400 on validation error
- Rate limited to 10 requests per minute`
};

// DOM Elements
const requirementInput = document.getElementById('requirementInput');
const generateBtn = document.getElementById('generateBtn');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsSection');
const agentStatus = document.getElementById('agentStatus');
const testCasesList = document.getElementById('testCasesList');
const totalTestsEl = document.getElementById('totalTests');

// Example buttons
document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const example = btn.dataset.example;
        requirementInput.value = examples[example];
        requirementInput.focus();
    });
});

// Generate button
generateBtn.addEventListener('click', async () => {
    const description = requirementInput.value.trim();
    
    if (!description) {
        alert('Please enter a requirement or feature description');
        return;
    }
    
    await generateTestCases(description);
});

// Main generation function
async function generateTestCases(description) {
    // Show loading state
    loadingState.style.display = 'block';
    resultsSection.style.display = 'none';
    generateBtn.disabled = true;
    
    // Animate agent status bar
    agentStatus.classList.add('active');
    
    // Simulate agent progression
    const agents = ['context', 'understanding', 'modeling', 'generation', 'validation'];
    
    for (let i = 0; i < agents.length; i++) {
        const agentEl = document.querySelector(`[data-agent="${agents[i]}"]`);
        agentEl.classList.add('active');
        
        await sleep(600);
        
        agentEl.classList.remove('active');
        agentEl.classList.add('completed');
    }
    
    try {
        // Call API
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description,
                options: {
                    includeSecurity: document.getElementById('includeSecurity').checked,
                    includeBoundary: document.getElementById('includeBoundary').checked,
                    includeNegative: document.getElementById('includeNegative').checked
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate test cases');
        }
        
        const result = await response.json();
        currentResult = result;
        currentTestCases = result.testCases;
        
        // Display results
        displayResults(result);
        
        // Update total tests counter
        updateTotalTests();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate test cases. Please try again.');
    } finally {
        loadingState.style.display = 'none';
        generateBtn.disabled = false;
        agentStatus.classList.remove('active');
        
        // Reset agent status
        document.querySelectorAll('.agent-step').forEach(el => {
            el.classList.remove('active', 'completed');
        });
    }
}

// Display results
function displayResults(result) {
    resultsSection.style.display = 'block';
    
    // Update coverage summary
    updateCoverageSummary(result.coverage);
    
    // Display test cases
    displayTestCases(result.testCases);
    
    // Display insights
    displayInsights(result);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Update coverage summary
function updateCoverageSummary(coverage) {
    document.getElementById('functionalCount').textContent = coverage.functional;
    document.getElementById('negativeCount').textContent = coverage.negative;
    document.getElementById('boundaryCount').textContent = coverage.boundary;
    document.getElementById('securityCount').textContent = coverage.security;
    document.getElementById('coverageScore').textContent = `${coverage.score}%`;
}

// Display test cases
function displayTestCases(testCases, filter = 'all') {
    testCasesList.innerHTML = '';
    
    const filtered = filter === 'all' 
        ? testCases 
        : testCases.filter(tc => tc.type === filter);
    
    filtered.forEach(tc => {
        const card = createTestCaseCard(tc);
        testCasesList.appendChild(card);
    });
    
    if (filtered.length === 0) {
        testCasesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No test cases match this filter</p>';
    }
}

// Create test case card
function createTestCaseCard(tc) {
    const card = document.createElement('div');
    card.className = 'test-case-card';
    
    card.innerHTML = `
        <div class="test-case-header">
            <div class="test-case-title">
                <div class="test-case-id">${tc.id}</div>
                <div class="test-case-name">${tc.title}</div>
            </div>
            <div class="test-case-badges">
                <span class="badge badge-type">${tc.type}</span>
                <span class="badge badge-priority">${tc.priority}</span>
                <span class="badge badge-risk">${tc.risk}</span>
            </div>
        </div>
        
        <div class="test-case-content">
            <div class="test-case-section">
                <h4>Preconditions</h4>
                <ul>
                    ${tc.preconditions.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>
            
            <div class="test-case-section">
                <h4>Test Steps</h4>
                <ol>
                    ${tc.steps.map(s => `<li>${s}</li>`).join('')}
                </ol>
            </div>
            
            <div class="test-case-section">
                <h4>Expected Result</h4>
                <div class="test-case-result">${tc.expectedResult}</div>
            </div>
        </div>
    `;
    
    return card;
}

// Display insights
function displayInsights(result) {
    // Features
    const featuresEl = document.getElementById('detectedFeatures');
    featuresEl.innerHTML = result.context.features
        .map(f => `<span class="tag">${f}</span>`)
        .join('');
    
    // Actors
    const actorsEl = document.getElementById('detectedActors');
    actorsEl.innerHTML = result.context.actors
        .map(a => `<span class="tag">${a}</span>`)
        .join('');
    
    // Business Rules
    const rulesEl = document.getElementById('businessRules');
    rulesEl.innerHTML = result.understanding.rules
        .map(r => `<div class="rule-item">${r}</div>`)
        .join('');
    
    // Assumptions
    const assumptionsEl = document.getElementById('assumptions');
    assumptionsEl.innerHTML = result.understanding.assumptions
        .map(a => `<div class="rule-item">${a}</div>`)
        .join('');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter test cases
        const filter = btn.dataset.filter;
        displayTestCases(currentTestCases, filter);
    });
});

// Export buttons
document.querySelectorAll('.export-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const format = btn.dataset.format;
        await exportTestCases(format);
    });
});

// Export function
async function exportTestCases(format) {
    if (!currentTestCases || currentTestCases.length === 0) {
        alert('No test cases to export');
        return;
    }
    
    try {
        const response = await fetch('/api/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                testCases: currentTestCases,
                format
            })
        });
        
        if (!response.ok) {
            throw new Error('Export failed');
        }
        
        const result = await response.json();
        
        // Download file
        downloadFile(result.data, `test-cases.${format}`, getMimeType(format));
        
    } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export test cases');
    }
}

// Download file helper
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Get MIME type
function getMimeType(format) {
    const types = {
        json: 'application/json',
        gherkin: 'text/plain',
        markdown: 'text/markdown',
        csv: 'text/csv'
    };
    return types[format] || 'text/plain';
}

// Update total tests counter
async function updateTotalTests() {
    try {
        const response = await fetch('/api/history');
        const history = await response.json();
        
        const total = history.reduce((sum, item) => sum + item.testCases.length, 0);
        totalTestsEl.textContent = total;
        
    } catch (error) {
        console.error('Failed to update total tests:', error);
    }
}

// Utility: Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateTotalTests();
    
    // Add enter key support for textarea (Ctrl+Enter to generate)
    requirementInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateBtn.click();
        }
    });
});

// Add visual feedback for typing
let typingTimer;
requirementInput.addEventListener('input', () => {
    clearTimeout(typingTimer);
    requirementInput.style.borderColor = 'var(--accent-blue)';
    
    typingTimer = setTimeout(() => {
        requirementInput.style.borderColor = 'var(--border-color)';
    }, 1000);
});

// Console welcome message
console.log('%c🤖 Agentic Test Generator', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cUniversal AI-Powered Test Case Generation System', 'font-size: 12px; color: #a0aec0;');
console.log('%c7 Specialized AI Agents Working Together', 'font-size: 12px; color: #4facfe;');
