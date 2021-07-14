/**
 * HANDLE THE BUTTON PRESS UPDATE
 */
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-raise-value-btn]")) handleUpVote(e.target);
});

/**
 *
 * @param {*} button
 * @returns {void}
 * HANDLES THE UPPING OF THE VALUE OF SOMEONE ON THE FRONT END
 */
function handleUpVote(button) {
  button.disabled = true;
  const pageCard = button.closest("[data-page-id]");
  fetch("/increase-value", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      pageId: pageCard.dataset.pageId,
    }),
  })
    .then((res) => res.json())
    .then((value) => {
      const valueCount = pageCard.querySelector("[data-raise-value-count]");
      valueCount.textContent = value;
    })
    .finally(() => {
      button.disabled = false;
    });
}
