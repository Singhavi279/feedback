document.addEventListener("DOMContentLoaded", function() {
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("stickyButton");
  var span = document.getElementsByClassName("close")[0];
  var categorySelect = document.getElementById("category");
  var categories = document.querySelectorAll('.categoryQuestions');

  // When the user clicks the button, open the modal 
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  // Function to show questions based on selected category
  function showQuestions(category) {
    categories.forEach(function(cat) {
      cat.style.display = "none";
    });
    document.getElementById(category + 'Questions').style.display = "block";
  }

  // Show questions based on initial category
  showQuestions(categorySelect.value);

  // Event listener for category change
  categorySelect.addEventListener('change', function() {
    showQuestions(this.value);
  });

  // Function to send form data to Google Sheets using Apps Script deployment
  async function sendDataToSheets(formData) {
    const deploymentUrl = "https://script.google.com/macros/library/d/1idcZIo2s7toP5S3EinK8fS4e8W_cTwZZtRN61WQIo4VGZN4kGf5ZZbpY/1"; // Replace with your actual deployment URL
  
    try {
      const response = await fetch(deploymentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        mode: "no-cors", // Set mode to 'no-cors'
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send data to Google Sheet. Status: ${response.status} ${response.statusText}`);
      }
  
      console.log("Data sent successfully!");
    } catch (error) {
      console.error("Error sending data to Google Sheet:", error.message);
      // Optionally, handle error gracefully (e.g., show error message to user)
    }
  }  

  // Handle form submission
document.getElementById("feedbackForm").addEventListener("submit", function(event) {
  event.preventDefault();

  var category = document.getElementById("category").value;
  var formData = { category: category };
  
  // Populate formData object with form inputs
  if (category === 'feedback') {
    formData.experience = document.querySelector('input[name="experience"]:checked').value;
    formData.likedMost = document.getElementById("likedMost").value;
    formData.leastIntuitive = document.getElementById("leastIntuitive").value;
    formData.improvements = [];
    document.querySelectorAll('input[name="improvements"]:checked').forEach(function(element) {
      formData.improvements.push(element.value);
    });
    formData.recommend = document.querySelector('input[name="recommend"]:checked').value;
    if (formData.recommend === 'No') {
      formData.recommendReason = document.getElementById("recommendReason").value;
    }
    formData.additionalComments = document.getElementById("additionalComments").value;
  } else if (category === 'feature') {
    formData.featureTitle = document.getElementById("featureTitle").value;
    formData.featureDescription = document.getElementById("featureDescription").value;
    formData.featureFunctionality = document.getElementById("featureFunctionality").value;
    formData.featureImportance = document.getElementById("featureImportance").value;
    // Handle file upload for screenshot
  } else if (category === 'bug') {
    formData.bugModule = document.getElementById("bugModule").value;
    formData.bugDescription = document.getElementById("bugDescription").value;
    // Handle file upload for screenshot and console screenshot
    formData.bugExpected = document.getElementById("bugExpected").value;
    formData.bugFunctionality = document.getElementById("bugFunctionality").value;
    formData.bugReproduce = document.getElementById("bugReproduce").value;
  }

  // Add timestamp to formData
  formData.timestamp = new Date().toISOString();

  sendDataToSheets(formData); // Use the new function to send data to Apps Script

    // Close modal after submission
    modal.style.display = "none";
  });
});
