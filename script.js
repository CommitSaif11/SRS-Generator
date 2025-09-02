function generatePreview() {
  const fields = ["project","author","date","purpose","audience","scope","definitions","references","ui","sysint","constraints","fr","nfr","testing","deliverables"];
  const v = Object.fromEntries(fields.map(f=>[f, document.getElementById(f).value]));
  
  // Check required fields
  if (!v.project || !v.author || !v.purpose) {
    return;
  }
  
  let html = `
  <div class='cover-page'>
    <h1>Software Requirements Specification</h1>
    <p><strong>Project:</strong> ${v.project || ""}</p>
    <p><strong>Author:</strong> ${v.author || ""}</p>
    <p><strong>Date:</strong> ${v.date || ""}</p>
  </div>`;
  
  html += section("1. Purpose", v.purpose);
  html += section("2. Intended Audience", v.audience);
  html += section("3. Project Scope", v.scope);
  html += section("4. Definitions and Abbreviations", v.definitions);
  html += section("5. References", v.references);
  html += section("6. User Interface Requirements", v.ui);
  html += section("7. System Interfaces", v.sysint);
  html += section("8. Design Constraints", v.constraints);
  html += section("9. Functional Requirements", v.fr);
  html += section("10. Non-Functional Requirements", v.nfr);
  html += section("11. Testing and Verification", v.testing);
  html += section("12. Project Deliverables", v.deliverables);
  
  document.getElementById("preview").innerHTML = html;
  document.getElementById("preview").style.display = "block";
  document.getElementById("downloadBtn").style.display = "inline-block";
}

function section(title, content) {
  return content ? `<h2>${title}</h2><p>${content.replace(/\n/g,'<br>')}</p>` : "";
}

function downloadPDF() {
  const element = document.getElementById("preview");
  const projectName = document.getElementById("project").value || "SRS_Document";
  
  if (!element || !element.innerHTML.trim()) {
    return;
  }
  
  const options = {
    margin: [15, 15, 15, 15],
    filename: `${projectName}_SRS.pdf`,
    image: { 
      type: 'jpeg', 
      quality: 0.98
    },
    html2canvas: { 
      scale: 3,
      scrollY: 0,
      useCORS: true,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      dpi: 300,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: false
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'] 
    }
  };
  
  html2pdf().set(options).from(element).save();
}

function showForm() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("formSection").style.display = "block";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function sampleFill() {
  const sampleData = {
    project: "Smart Home Dashboard",
    author: "Saif Alam", 
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
  
  Object.keys(sampleData).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      element.value = sampleData[key];
    }
  });
}

function clearForm() {
  const fields = ["project","author","date","purpose","audience","scope","definitions","references","ui","sysint","constraints","fr","nfr","testing","deliverables"];
  const today = new Date().toISOString().slice(0,10);
  
  fields.forEach(f => document.getElementById(f).value = "");
  document.getElementById("date").value = today;
  document.getElementById("preview").style.display = "none";
  document.getElementById("downloadBtn").style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById("date").value = today;
});