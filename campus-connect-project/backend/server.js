const express = require("express");

const app = express();
const PORT = 3000;
const enquiries = [];

app.use(express.json());

app.use(function (request, response, next) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", function (request, response) {
  response.status(200).json({
    success: true,
    message: "CampusConnect backend is running"
  });
});

app.get("/api/enquiries", function (request, response) {
  response.status(200).json({
    success: true,
    count: enquiries.length,
    data: enquiries
  });
});

app.post("/api/enquiries", function (request, response) {
  const name = request.body.name;
  const email = request.body.email;
  const course = request.body.course;
  const message = request.body.message;

  if (!name || name.trim().length < 3) {
    return response.status(400).json({
      success: false,
      message: "Name must be at least 3 characters."
    });
  }

  if (!email || !email.includes("@")) {
    return response.status(400).json({
      success: false,
      message: "Valid email is required."
    });
  }

  if (!course) {
    return response.status(400).json({
      success: false,
      message: "Course is required."
    });
  }

  if (!message || message.trim().length < 10) {
    return response.status(400).json({
      success: false,
      message: "Message must be at least 10 characters."
    });
  }

  const newEnquiry = {
    id: enquiries.length + 1,
    name: name.trim(),
    email: email.trim(),
    course: course,
    message: message.trim()
  };

  enquiries.push(newEnquiry);

  response.status(201).json({
    success: true,
    message: "Enquiry saved successfully on backend.",
    data: newEnquiry
  });
});

app.use(function (request, response) {
  response.status(404).json({
    success: false,
    message: "API route not found"
  });
});

app.listen(PORT, function () {
  console.log("CampusConnect API running on http://localhost:" + PORT);
});
