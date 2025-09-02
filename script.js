// Configuration
const CONFIG = {
  fields: [
    "project", "author", "github", "date", "purpose", "audience", "scope", 
    "definitions", "references", "ui", "sysint", "constraints", 
    "fr", "nfr", "testing", "deliverables"
  ],
  requiredFields: ["project", "author", "date", "purpose"],
  animations: {
    duration: 300,
    easing: 'ease-in-out'
  }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setCurrentDate();
  setupEventListeners();
  addFormValidation();
}

function setCurrentDate() {
  const today = new Date().toISOString().slice(0, 10);
  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.value = today;
  }
}

function setupEventListeners() {
  // Add input validation listeners
  CONFIG.requiredFields.forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.addEventListener('blur', validateField);
      element.addEventListener('input', clearFieldError);
    }
  });

  // Add GitHub URL validation
  const githubInput = document.getElementById('github');
  if (githubInput) {
    githubInput.addEventListener('blur', validateGitHubUrl);
  }
}

function addFormValidation() {
  const form = document.querySelector('.form-content');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

function validateField(event) {
  const field = event.target;
  const fieldId = field.id;
  const value = field.value.trim();
  
  if (CONFIG.requiredFields.includes(fieldId) && !value) {
    showFieldError(field, 'This field is required');
    return false;
  }
  
  clearFieldError(field);
  return true;
}

function validateGitHubUrl(event) {
  const field = event.target;
  const value = field.value.trim();
  
  if (value && !isValidGitHubUrl(value)) {
    showFieldError(field, 'Please enter a valid GitHub URL');
    return false;
  }
  
  clearFieldError(field);
  return true;
}

function isValidGitHubUrl(url) {
  const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
  return githubUrlPattern.test(url);
}

function showFieldError(field, message) {
  clearFieldError(field);
  
  field.style.borderColor = 'var(--danger-color)';
  
  const errorElement = document.createElement('small');
  errorElement.className = 'field-error';
  errorElement.style.color = 'var(--danger-color)';
  errorElement.style.marginTop = '4px';
  errorElement.textContent = message;
  
  field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
  if (typeof field === 'object' && field.target) {
    field = field.target;
  }
  
  field.style.borderColor = 'var(--gray-200)';
  
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  
  if (validateAllFields()) {
    generatePreview();
  } else {
    showNotification('Please fill in all required fields correctly', 'error');
  }
}

function validateAllFields() {
  let isValid = true;
  
  CONFIG.requiredFields.forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element && !validateField({ target: element })) {
      isValid = false;
    }
  });
  
  const githubInput = document.getElementById('github');
  if (githubInput && githubInput.value.trim() && !validateGitHubUrl({ target: githubInput })) {
    isValid = false;
  }
  
  return isValid;
}

function showForm() {
  const landing = document.getElementById("landing");
  const formSection = document.getElementById("formSection");
  
  if (landing && formSection) {
    // Add fade out animation to landing
    landing.style.opacity = '0';
    landing.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      landing.style.display = "none";
      formSection.style.display = "block";
      
      // Smooth scroll to top
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      // Focus on first input
      setTimeout(() => {
        const firstInput = document.getElementById('project');
        if (firstInput) {
          firstInput.focus();
        }
      }, 500);
      
    }, CONFIG.animations.duration);
  }
}

function generatePreview() {
  if (!validateAllFields()) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  const formData = getFormData();
  const previewHtml = generatePreviewHtml(formData);
  
  const previewElement = document.getElementById("preview");
  const downloadBtn = document.getElementById("downloadBtn");
  
  if (previewElement && downloadBtn) {
    previewElement.innerHTML = previewHtml;
    previewElement.style.display = "block";
    downloadBtn.style.display = "inline-flex";
    
    // Smooth scroll to preview
    previewElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    showNotification('Preview generated successfully!', 'success');
  }
}

function getFormData() {
  const data = {};
  CONFIG.fields.forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element) {
      data[fieldId] = element.value.trim();
    }
  });
  return data;
}

function generatePreviewHtml(data) {
  let html = `
    <div class='cover-page'>
      <h1>Software Requirements Specification</h1>
      <p><strong>Project:</strong> ${data.project || 'N/A'}</p>
      <p><strong>Author:</strong> ${data.author || 'N/A'}</p>
      <p><strong>Date:</strong> ${formatDate(data.date) || 'N/A'}</p>
      ${data.github ? `<p><strong>Repository:</strong> <a href="${data.github}" target="_blank">${data.github}</a></p>` : ''}
    </div>
  `;
  
  // Add sections
  const sections = [
    { key: 'purpose', title: '1. Purpose' },
    { key: 'audience', title: '2. Intended Audience' },
    { key: 'scope', title: '3. Project Scope' },
    { key: 'definitions', title: '4. Definitions and Abbreviations' },
    { key: 'references', title: '5. References' },
    { key: 'ui', title: '6. User Interface Requirements' },
    { key: 'sysint', title: '7. System Interfaces' },
    { key: 'constraints', title: '8. Design Constraints' },
    { key: 'fr', title: '9. Functional Requirements' },
    { key: 'nfr', title: '10. Non-Functional Requirements' },
    { key: 'testing', title: '11. Testing and Verification' },
    { key: 'deliverables', title: '12. Project Deliverables' }
  ];
  
  sections.forEach(section => {
    if (data[section.key]) {
      html += `
        <h2>${section.title}</h2>
        <p>${formatContent(data[section.key])}</p>
      `;
    }
  });
  
  return html;
}

function formatContent(content) {
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function downloadPDF() {
  const element = document.getElementById("preview");
  const projectName = document.getElementById("project").value.trim();
  
  if (!element) {
    showNotification('No preview available to download', 'error');
    return;
  }
  
  const filename = projectName ? 
    `${sanitizeFilename(projectName)}_SRS.pdf` : 
    'SRS_Document.pdf';
  
  const options = {
    margin: [15, 15, 15, 15],
    filename: filename,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2,
      scrollY: 0,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'] 
    }
  };
  
  // Show loading notification
  showNotification('Generating PDF... Please wait', 'info');
  
  html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      showNotification('PDF downloaded successfully!', 'success');
    })
    .catch((error) => {
      console.error('PDF generation error:', error);
      showNotification('Error generating PDF. Please try again.', 'error');
    });
}

function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function sampleFill() {
  const sampleData = {
    project: "Smart Home Dashboard",
    author: "Saif Alam",
    github: "https://github.com/CommitSaif11/smart-home-dashboard",
    purpose: "Provide a centralized control system for managing smart home devices, monitoring energy consumption, and automating routine tasks to enhance user convenience and energy efficiency.",
    audience: "Software developers, system architects, quality assurance engineers, project stakeholders, and end-users including homeowners and property managers.",
    scope: "The system will provide device control, real-time monitoring, automated scheduling, energy analytics, and mobile/web interfaces. It will not include device manufacturing or third-party device warranty services.",
    definitions: "IoT - Internet of Things; API - Application Programming Interface; MQTT - Message Queuing Telemetry Transport; UI - User Interface; REST - Representational State Transfer",
    references: "IEEE Std 830-1998 for SRS templates, IoT Security Guidelines NIST, Smart Home Standards documentation, React.js Documentation, Node.js Best Practices Guide",
    ui: "Modern responsive web dashboard with real-time device status, interactive charts for energy consumption, device control panels, automation rule builder, and mobile-optimized interface",
    sysint: "REST API for device communication, MQTT broker for real-time messaging, database integration (PostgreSQL), third-party IoT platform APIs, weather service integration, notification services",
    constraints: "Must support modern web browsers, responsive design for mobile devices, response time under 2 seconds, 99.9% uptime requirement, compliance with data privacy regulations",
    fr: "FR1: User authentication and authorization\nFR2: Device discovery and registration\nFR3: Real-time device control\nFR4: Automation rule creation and management\nFR5: Energy consumption tracking\nFR6: Alert and notification system\nFR7: User profile management",
    nfr: "Performance: System response time < 2 seconds\nScalability: Support up to 100 devices per user\nSecurity: Data encryption, secure authentication\nUsability: Intuitive interface, accessibility compliant\nReliability: 99.9% uptime, automatic failover",
    testing: "Unit testing for all components, Integration testing for API endpoints, End-to-end testing for user workflows, Performance testing under load, Security penetration testing, User acceptance testing with stakeholders",
    deliverables: "Source code repository, Technical documentation, User manual, Deployment guide, API documentation, Test reports, System architecture diagrams, Database schema documentation"
  };
  
  // Fill form with sample data
  Object.keys(sampleData).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      element.value = sampleData[key];
      
      // Add a subtle animation to show the field was filled
      element.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 1000);
    }
  });
  
  showNotification('Sample data filled successfully!', 'success');
  
  // Auto-focus on first field
  setTimeout(() => {
    const firstInput = document.getElementById('project');
    if (firstInput) {
      firstInput.focus();
    }
  }, 100);
}

function clearForm() {
  if (confirm('Are you sure you want to clear all form data?')) {
    // Clear all fields
    CONFIG.fields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.value = "";
        clearFieldError(element);
      }
    });
    
    // Reset date to current date
    setCurrentDate();
    
    // Hide preview and download button
    const previewElement = document.getElementById("preview");
    const downloadBtn = document.getElementById("downloadBtn");
    
    if (previewElement) {
      previewElement.style.display = "none";
    }
    
    if (downloadBtn) {
      downloadBtn.style.display = "none";
    }
    
    showNotification('Form cleared successfully!', 'info');
    
    // Focus on first input
    setTimeout(() => {
      const firstInput = document.getElementById('project');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }
}

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const colors = {
    success: 'var(--success-color)',
    error: 'var(--danger-color)',
    warning: 'var(--warning-color)',
    info: 'var(--primary-color)'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${colors[type] || colors.info};
    color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    font-weight: 500;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
    cursor: pointer;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Add click to dismiss
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(notificationStyles);

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
  // Ctrl/Cmd + Enter to generate preview
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    generatePreview();
  }
  
  // Ctrl/Cmd + S to download PDF (if preview is available)
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn && downloadBtn.style.display !== 'none') {
      downloadPDF();
    }
  }
  
  // Escape to clear form (with confirmation)
  if (event.key === 'Escape' && event.shiftKey) {
    event.preventDefault();
    clearForm();
  }
});

// Initialize tooltips for keyboard shortcuts
document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.querySelector('[onclick="generatePreview()"]');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearBtn = document.querySelector('[onclick="clearForm()"]');
  
  if (generateBtn) {
    generateBtn.title = 'Generate Preview (Ctrl+Enter)';
  }
  
  if (downloadBtn) {
    downloadBtn.title = 'Download PDF (Ctrl+S)';
  }
  
  if (clearBtn) {
    clearBtn.title = 'Clear Form (Shift+Esc)';
  }
});