$(document).ready(function () {
  function showErrorIcon(element, message) {
    let icon = $(element).parent().find(".info-icon");
    icon.attr("data-original-title", message);
    $(element).siblings(".error-icon").text(message);
  }

  function calculateTax(grossIncome, extraIncome, ageGroup, deductions) {
    let totalIncome =
      parseFloat(grossIncome) +
      parseFloat(extraIncome) -
      parseFloat(deductions);
    let overallIncome;
    if (totalIncome <= 800000) {
      overallIncome = totalIncome;
    } else {
      let taxRate = 0;
      if (ageGroup === "<40") {
        taxRate = 0.3;
      } else if (ageGroup === "40-60") {
        taxRate = 0.4;
      } else if (ageGroup === "≥60") {
        taxRate = 0.1;
      }

      const totalTax = taxRate * (totalIncome - 800000);
      overallIncome = totalIncome - totalTax;
    }
    return overallIncome;
  }

  function showResultModal(overallIncome) {
    $("#resultBody").html(`
      <p>Your overall income will be: ${overallIncome.toFixed(
        2
      )} INR after tax</p>
    `);
    $("#resultModal").modal("show");

    $("#resultModal").on("shown.bs.modal", function () {
      var modal = $(this);
      var modalDialog = modal.find(".modal-dialog");
      var topPosition = Math.max(
        0,
        ($(window).height() - modalDialog.height()) / 2
      );
      modalDialog.css("margin-top", topPosition);
    });
  }

  function validateInput() {
    let isValid = true;
    let grossIncome = $("#grossIncome").val();

    if (grossIncome.trim() === "") {
      $("#grossIncomeError").css("display", "flex");
      isValid = false;
    } else if (isNaN(grossIncome) || parseFloat(grossIncome) <= 0) {
      $("#grossIncomeError").css("display", "flex");
      isValid = false;
    } else {
      $("#grossIncomeError").css("display", "none");
    }

    let extraIncome = $("#extraIncome").val();
    if (extraIncome.trim() === "") {
      $("#extraIncomeError").css("display", "flex");
      isValid = false;
    } else if (isNaN(extraIncome) || parseFloat(extraIncome) < 0) {
      $("#extraIncomeError").css("display", "flex");
      isValid = false;
    } else {
      $("#extraIncomeError").css("display", "none");
    }

    let ageGroup = $("#ageGroup").val();
    if (ageGroup.trim() === "") {
      $("#ageGroupError").text("Please select an age group.");
      isValid = false;
    } else if (!["<40", "40-60", "≥60"].includes(ageGroup)) {
      $("#ageGroupError").text("Please select a valid age group.");
      isValid = false;
    } else {
      $("#ageGroupError").text("");
    }

    let deductions = $("#deductions").val();
    if (deductions.trim() === "") {
      $("#deductionsError").css("display", "flex");
      isValid = false;
    } else if (isNaN(deductions) || parseFloat(deductions) < 0) {
      $("#deductionsError").css("display", "flex");
      isValid = false;
    } else {
      $("#deductionsError").css("display", "none");
    }
    return isValid;
  }

  $("#submitBtn").click(function () {
    if (!validateInput()) {
      return; // Don't proceed if validation fails
    }
    let grossIncome = $("#grossIncome").val();
    let extraIncome = $("#extraIncome").val();
    let ageGroup = $("#ageGroup").val();
    let deductions = $("#deductions").val();
    let IncomeAmount = calculateTax(
      grossIncome,
      extraIncome,
      ageGroup,
      deductions
    );
    if (grossIncome && extraIncome && ageGroup && deductions) {
      showResultModal(IncomeAmount);
    }
    // .3 * (40 - 8) = .3 * 32
  });
});
