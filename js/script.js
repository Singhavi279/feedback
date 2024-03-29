document.addEventListener("DOMContentLoaded", function () {
  // **Modal Elements**
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("stickyButton");
  var span = document.getElementsByClassName("close")[0];

  // **Category and Questions**
  var categorySelect = document.getElementById("category");
  var categories = document.querySelectorAll('.categoryQuestions');

  // **Modal Functions**
  function openModal() {
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  // **Category Change**
  function showQuestions(category) {
    categories.forEach(function (cat) {
      cat.style.display = "none";
    });
    document.getElementById(category + 'Questions').style.display = "block";
  }

  // **Event Listeners**
  btn.addEventListener("click", openModal);
  span.addEventListener("click", closeModal);
  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  };
  categorySelect.addEventListener('change', function () {
    showQuestions(this.value);
  });

  // **Form Submission**
  document.getElementById("feedbackForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var category = document.getElementById("category").value;
    var formData = { category: category, timestamp: new Date().toISOString() };

    // **Populate formData based on category**
    if (category === 'feedback') {
      formData.experience = document.querySelector('input[name="experience"]:checked').value;
      formData.likedMost = document.getElementById("likedMost").value;
      formData.leastIntuitive = document.getElementById("leastIntuitive").value;
      formData.improvements = [];
      document.querySelectorAll('input[name="improvements"]:checked').forEach(function (element) {
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
      // Handle file upload for screenshot (implementation needed)
    } else if (category === 'bug') {
      formData.bugModule = document.getElementById("bugModule").value;
      formData.bugDescription = document.getElementById("bugDescription").value;
      // Handle file upload for screenshot and console screenshot (implementation needed)
      formData.bugExpected = document.getElementById("bugExpected").value;
      formData.bugFunctionality = document.getElementById("bugFunctionality").value;
      formData.bugReproduce = document.getElementById("bugReproduce").value;
    }

    // **Send Data to Google Apps Script (consider using fetch API)**
    async function sendDataToSheets(formData) {
      const deploymentUrl = "https://script.google.com/macros/s/YOUR_SHEET_ID/exec"; // Replace with your actual deployment URL

      try {
        const response = await fetch(deploymentUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error(`Failed to send data to Google Sheet. Status: ${response.status} ${response.statusText}`);
        }

        console.log("Data sent successfully!");
        closeModal(); // Close modal after successful submission
      } catch (error) {
        console.error("Error sending data to Google Sheet:", error.message);
        // Optionally, handle error gracefully (e.g., show error message to user)
      }
    }

    sendDataToSheets(formData);
  });

  // **Initial Category Selection**
  showQuestions(categorySelect.value);
});
