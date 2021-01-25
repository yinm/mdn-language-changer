export function showSnackbar(message: string, ms = 5000): void {
  const snackbar = createSnackbar(message);

  setTimeout(() => {
    snackbar.style.display = "none";
  }, ms);
}

function createSnackbar(message: string): HTMLDivElement {
  const snackbar = document.createElement("div");
  snackbar.textContent = message;
  snackbar.style.cssText = `
--heightValue: 3rem;

position: fixed;
bottom: 1rem;
left: 50%;
transform: translateX(-50%);
width: 30%;
height: var(--heightValue);
line-height: var(--heightValue);
text-align: center;
background-color: #333;
color: #fff;
box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 
  0 1px 18px 0 rgba(0, 0, 0, 0.12), 
  0 3px 5px -1px rgba(0, 0, 0, 0.2);
`;
  document.body.appendChild(snackbar);

  return snackbar;
}
