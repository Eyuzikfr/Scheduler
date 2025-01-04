const inputs = document.querySelectorAll(".code-box");

inputs.forEach((input, index) => {
    // Allow only one digit and auto-focus to the next input
    input.addEventListener("input", (e) => {
        const value = e.target.value;

        // Clear any non-numeric input
        if (!/^\d$/.test(value)) {
            e.target.value = "";
            return;
        }

        // Move to the next input if a number is entered
        if (index < inputs.length - 1 && value) {
            inputs[index + 1].focus();
        }
    });

    // Handle Backspace key behavior
    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
            if (e.target.value) {
                e.target.value = ""; // Clear current input
            } else if (index > 0) {
                // Move focus to the previous input and clear it
                inputs[index - 1].focus();
                inputs[index - 1].value = "";
            }
            e.preventDefault(); // Prevent default backspace behavior
        }

        // Handle Left Arrow Key
        if (e.key === "ArrowLeft" && index > 0) {
            inputs[index - 1].focus();
        }

        // Handle Right Arrow Key
        if (e.key === "ArrowRight" && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    // Prevent pasting more than one character
    input.addEventListener("paste", (e) => {
        const pastedData = e.clipboardData.getData("text");
        if (!/^\d$/.test(pastedData)) {
            e.preventDefault(); // Prevent invalid input
        } else {
            e.target.value = pastedData;
            if (index < inputs.length - 1) inputs[index + 1].focus();
        }
    });

    // Auto-select the content of the input when focused
    input.addEventListener("focus", () => {
        input.select();
    });
});
