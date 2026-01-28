// certificate.js

// Helper: generate unique certificate ID
function generateCertificateId() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `QS-${year}-${random}`;
}

// Helper: format date as DD/MM/YYYY
function getFormattedDate() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Load certificate data
window.onload = function () {

  // These keys must already be saved after quiz result
  const userName = localStorage.getItem("qs_user_name") || "STUDENT NAME";
  const domain = localStorage.getItem("qs_domain") || "DOMAIN NAME";
  const score = localStorage.getItem("qs_score") || 0;
  const mode = localStorage.getItem("qs_mode");

  // Safety check: certificate only for challenge mode
  if (mode !== "challenge") {
    alert("Certificate is available only for Challenge Mode.");
    window.location.href = "index.html";
    return;
  }

  // Safety check: minimum score
  if (parseInt(score) < 70) {
    alert("You need at least 70% to earn the certificate.");
    window.location.href = "result.html";
    return;
  }

  // Fill certificate fields
  document.getElementById("userName").innerText = userName;
  document.getElementById("domainName").innerText = domain + " CERTIFICATION";
  document.getElementById("date").innerText = getFormattedDate();

  const certId = generateCertificateId();
  document.getElementById("certId").innerText = certId;

  // Save certificate to history (for My Certifications page later)
  const certificates = JSON.parse(localStorage.getItem("qs_certificates")) || [];

  certificates.push({
    id: certId,
    name: userName,
    domain: domain,
    date: getFormattedDate(),
    score: score
  });

  localStorage.setItem("qs_certificates", JSON.stringify(certificates));
};
