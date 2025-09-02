function generatePreview() {
  const fields = ["project","author","date","purpose","audience","scope","definitions","references","ui","sysint","constraints","fr","nfr","testing","deliverables"];
  const v = Object.fromEntries(fields.map(f=>[f, document.getElementById(f).value]));
  
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

// Pure text-based PDF generation for you, Saif
function downloadPDF() {
  const projectName = document.getElementById("project").value || "SRS_Document";
  const author = document.getElementById("author").value || "";
  const date = document.getElementById("date").value || "";
  
  // Get all the text content for you, Saif
  const fields = ["purpose","audience","scope","definitions","references","ui","sysint","constraints","fr","nfr","testing","deliverables"];
  const content = Object.fromEntries(fields.map(f=>[f, document.getElementById(f).value]));
  
  // Create pure text PDF using jsPDF for you, Saif
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  // Helper function to add text with wrapping for you, Saif
  function addText(text, fontSize = 12, isBold = false) {
    if (isBold) {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }
    doc.setFontSize(fontSize);
    
    const lines = doc.splitTextToSize(text, doc.internal.pageSize.width - 2 * margin);
    
    for (let line of lines) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.6;
    }
    yPosition += 5;
  }
  
  // Cover page for you, Saif
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Software Requirements Specification", 105, 100, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`Project: ${projectName}`, 105, 130, { align: 'center' });
  doc.text(`Author: ${author}`, 105, 150, { align: 'center' });
  doc.text(`Date: ${date}`, 105, 170, { align: 'center' });
  
  doc.addPage();
  yPosition = 20;
  
  // Add all sections for you, Saif
  if (content.purpose) {
    addText("1. Purpose", 16, true);
    addText(content.purpose, 12);
  }
  
  if (content.audience) {
    addText("2. Intended Audience", 16, true);
    addText(content.audience, 12);
  }
  
  if (content.scope) {
    addText("3. Project Scope", 16, true);
    addText(content.scope, 12);
  }
  
  if (content.definitions) {
    addText("4. Definitions and Abbreviations", 16, true);
    addText(content.definitions, 12);
  }
  
  if (content.references) {
    addText("5. References", 16, true);
    addText(content.references, 12);
  }
  
  if (content.ui) {
    addText("6. User Interface Requirements", 16, true);
    addText(content.ui, 12);
  }
  
  if (content.sysint) {
    addText("7. System Interfaces", 16, true);
    addText(content.sysint, 12);
  }
  
  if (content.constraints) {
    addText("8. Design Constraints", 16, true);
    addText(content.constraints, 12);
  }
  
  if (content.fr) {
    addText("9. Functional Requirements", 16, true);
    addText(content.fr, 12);
  }
  
  if (content.nfr) {
    addText("10. Non-Functional Requirements", 16, true);
    addText(content.nfr, 12);
  }
  
  if (content.testing) {
    addText("11. Testing and Verification", 16, true);
    addText(content.testing, 12);
  }
  
  if (content.deliverables) {
    addText("12. Project Deliverables", 16, true);
    addText(content.deliverables, 12);
  }
  
  // Save the PDF for you, Saif
  doc.save(`${projectName}_SRS.pdf`);
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