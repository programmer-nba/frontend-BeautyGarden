export function copyToClipboard(textToCopy) {
    navigator.clipboard.writeText(textToCopy)
    .then(() => {
    console.log('Text successfully copied to clipboard');
    // You can also provide user feedback here, e.g., by setting a flag or displaying a notification
    })
    .catch((err) => {
    console.error('Unable to copy text to clipboard', err);
    // Handle errors or provide user feedback
    });
}