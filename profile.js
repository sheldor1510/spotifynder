document.addEventListener("DOMContentLoaded", () => {
    const maxPrompts = 3; // Set max number of prompts to 3 based on Ui diagram
    const addPromptButton = document.querySelector(".add-prompt");
    const personalityPrompts = document.querySelector(".personality-prompts");

    // Event listener for adding new prompt
    addPromptButton.addEventListener("click", () => {
        // Check the curr no of prompts
        const currentPrompts = document.querySelectorAll(".personality-prompts .prompt").length;

        if (currentPrompts < maxPrompts) {
            // Add new prompt if curr prompts < max
            const newPrompt = document.createElement("div");
            newPrompt.classList.add("prompt");
            newPrompt.innerHTML = `
                <input type="text" placeholder="Question">
                <textarea placeholder="Answer..."></textarea>
            `;
            personalityPrompts.insertBefore(newPrompt, addPromptButton); // Insert the new prompt before add button
        } else {
            // Notify user max no of prompts reached
            alert("You've hit the high note on prompts! Try editing your top picks!");
        }
    });
});
