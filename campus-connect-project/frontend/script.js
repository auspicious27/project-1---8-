const enquiryForm = document.getElementById("enquiryForm");
const studentNameInput = document.getElementById("studentName");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const messageInput = document.getElementById("message");
const formMessage = document.getElementById("formMessage");
const enquiryList = document.getElementById("enquiryList");
const loadButton = document.getElementById("loadButton");
const clearButton = document.getElementById("clearButton");

function getLocalEnquiries() {
  const savedData = localStorage.getItem("campusEnquiries");
  return savedData ? JSON.parse(savedData) : [];
}

function saveLocalEnquiries(enquiries) {
  localStorage.setItem("campusEnquiries", JSON.stringify(enquiries));
}

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = "form-message " + type;
}

function validateForm(enquiry) {
  if (enquiry.name.length < 3) {
    return "Name must be at least 3 characters.";
  }

  if (!enquiry.email.includes("@")) {
    return "Please enter a valid email address.";
  }

  if (enquiry.course === "") {
    return "Please select a course.";
  }

  if (enquiry.message.length < 10) {
    return "Message must be at least 10 characters.";
  }

  return "";
}

function renderEnquiries() {
  const enquiries = getLocalEnquiries();
  enquiryList.innerHTML = "";

  if (enquiries.length === 0) {
    enquiryList.innerHTML = "<p>No enquiries saved yet.</p>";
    return;
  }

  enquiries.forEach(function (enquiry, index) {
    const card = document.createElement("article");
    card.className = "enquiry-item";
    card.innerHTML = `
      <h3>${index + 1}. ${enquiry.name}</h3>
      <p><strong>Email:</strong> ${enquiry.email}</p>
      <p><strong>Course:</strong> ${enquiry.course}</p>
      <p><strong>Message:</strong> ${enquiry.message}</p>
    `;
    enquiryList.appendChild(card);
  });
}

async function sendEnquiryToBackend(enquiry) {
  const response = await fetch("http://localhost:3000/api/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(enquiry)
  });

  return response.json();
}

enquiryForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const enquiry = {
    name: studentNameInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value,
    message: messageInput.value.trim()
  };

  const error = validateForm(enquiry);

  if (error) {
    showMessage(error, "error");
    return;
  }

  const enquiries = getLocalEnquiries();
  enquiries.push(enquiry);
  saveLocalEnquiries(enquiries);
  renderEnquiries();

  try {
    const result = await sendEnquiryToBackend(enquiry);
    showMessage(result.message, "success");
  } catch (error) {
    showMessage("Saved locally. Backend server is not running.", "error");
  }

  enquiryForm.reset();
});

loadButton.addEventListener("click", renderEnquiries);

clearButton.addEventListener("click", function () {
  localStorage.removeItem("campusEnquiries");
  renderEnquiries();
  showMessage("Local enquiries cleared.", "success");
});

renderEnquiries();
