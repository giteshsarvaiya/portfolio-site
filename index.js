
 
themeToggle();
  function themeToggle(){
  const debugToggle = document.querySelector(".debug-toggle");
  function onDebugToggle() {
    document.body.classList.toggle("debug", debugToggle.checked);
  }
  debugToggle.addEventListener("change", onDebugToggle);
  onDebugToggle();

  // Select the toggle button
const themeToggle = document.getElementById("theme-toggle");

// Apply the saved theme on page load
document.documentElement.setAttribute(
  "data-theme",
  localStorage.getItem("theme") || "light"
);

// Update button text based on the current theme
themeToggle.textContent =
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "Switch to Light Mode"
    : "Switch to Dark Mode";

// Toggle dark/light mode
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Apply the new theme and save it to localStorage
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Update button text
  themeToggle.textContent =
    newTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
});

}