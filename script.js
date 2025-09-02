function generatePreview() {
  const fields = ["project","author","date","purpose","audience","scope","definitions","references","ui","sysint","constraints","fr","nfr","testing","deliverables"];
  const v = Object.fromEntries(fields.map(f=>[f, document.getElementById(f).value.trim()]));
  
  // Check ALL fields are mandatory for you, Saif
  const missingFields = [];
  fields.forEach(field => {
    if (!v[field]) {
      missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
    }
  });
  
  if (missingFields.length > 0) {
    alert(`Please fill all required fields, Saif!\nMissing: ${missingFields.join(', ')}`);
    return;
  }
  
  let html = `
  <div class='cover-page'>
    <h1>Software Requirements Specification</h1>
    <p><strong>Project:</strong> ${v.project}</p>
    <p><strong>Author:</strong> ${v.author}</p>
    <p><strong>Date:</strong> ${v.date}</p>
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
    alert("Please generate preview first, Saif!");
    return;
  }
  
  // Check if jsPDF is available for you, Saif
  if (typeof window.jsPDF !== 'undefined') {
    generateTextPDF();
  } else if (typeof html2pdf !== 'undefined') {
    const options = {
      margin: 10,
      filename: `${projectName}_SRS.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  } else {
    downloadAsText();
  }
}

function generateTextPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const projectName = document.getElementById("project").value || "SRS_Document";
  
  let y = 20;
  
  doc.setFontSize(20);
  doc.text('Software Requirements Specification', 20, y);
  y += 20;
  
  doc.setFontSize(12);
  doc.text(`Project: ${document.getElementById("project").value}`, 20, y);
  y += 10;
  doc.text(`Author: ${document.getElementById("author").value}`, 20, y);
  y += 10;
  doc.text(`Date: ${document.getElementById("date").value}`, 20, y);
  y += 20;
  
  const sections = [
    ['Purpose', document.getElementById("purpose").value],
    ['Audience', document.getElementById("audience").value],
    ['Scope', document.getElementById("scope").value],
    ['Definitions', document.getElementById("definitions").value],
    ['References', document.getElementById("references").value],
    ['User Interface', document.getElementById("ui").value],
    ['System Interfaces', document.getElementById("sysint").value],
    ['Constraints', document.getElementById("constraints").value],
    ['Functional Requirements', document.getElementById("fr").value],
    ['Non-Functional Requirements', document.getElementById("nfr").value],
    ['Testing', document.getElementById("testing").value],
    ['Deliverables', document.getElementById("deliverables").value]
  ];
  
  sections.forEach(([title, content]) => {
    if (content) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.text(title, 20, y);
      y += 10;
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 20, y);
      y += lines.length * 5 + 10;
    }
  });
  
  doc.save(`${projectName}_SRS.pdf`);
}

function downloadAsText() {
  const projectName = document.getElementById("project").value || "SRS_Document";
  const content = document.getElementById("preview").innerText;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName}_SRS.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
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
  
  if (confirm("Are you sure you want to clear all data, Saif?")) {
    fields.forEach(f => document.getElementById(f).value = "");
    document.getElementById("date").value = today;
    document.getElementById("preview").style.display = "none";
    document.getElementById("downloadBtn").style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById("date").value = today;
});