// const dashBoardContainer = document.getElementById("dashBoardContainer");
// const map = document.getElementById("map");
// const table = document.getElementById("table");
// const chart = document.getElementById("chart");

// const chartFullScreen = document.getElementById("chart-full-screen");
const openButton = document.getElementById("full-screen-on");
const closeButton = document.getElementById("full-screen-off");

// chartFullScreen.addEventListener("click", toggleFullScreen);

document.getElementById("dashBoardContainer").onclick = function (event) {
  let target = event.target;
  if (target.id === "chart-full-screen-on" || "chart-full-screen-off") {
    toggleFullScreen();
  }
};

function toggleFullScreen() {
  dashBoardContainer.classList.toggle("chart-full-screen-grid-layout");
  dashBoardContainer.classList.toggle("dash-grid-layout");
  map.classList.toggle("hidden");
  table.classList.toggle("hidden");
  openButton.classList.toggle("hidden");
  closeButton.classList.toggle("hidden");
}
