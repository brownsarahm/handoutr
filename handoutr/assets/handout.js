// import mermaid from ';
mermaid.initialize({ startOnLoad: false });

// tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


// ------------------------------------------------------------------ 
//  Render the prompts
// ------------------------------------------------------------------ 
// Select all div elements with the class 'prompt'
const promptList = document.querySelectorAll('.promptgroup');

// Loop through each div with class 'prompt'
promptList.forEach(prompt => {
    // Find the textarea inside the div
    const textarea = prompt.querySelector('.promptbox');

    // Get the Markdown text from the textarea
    const markdownText = textarea.value;

    // Parse the Markdown text into HTML using marked.parse
    const htmlContent = marked.parse(markdownText);

    // Select the first <p> element within the current .prompt div
    const textAreaLabel = prompt.querySelector('label');

    // Set the innerHTML of the <p> element to the parsed HTML content
    textAreaLabel.innerHTML = htmlContent;
});

// ------------------------------------------------------------------ 
//  Preview functions
// ------------------------------------------------------------------ 

function toggleHTML(targetID,btnID) {

    const textareaId = 'textarea-' + targetID;
    const textarea = document.getElementById(textareaId);
    const divId = 'html-' + targetID;
    const div = document.getElementById(divId);

    const btn = document.getElementById(btnID);
    // Toggle the 'active' class on or off of the element in the variable 'btn'
    btn.classList.toggle('active');

    if (textarea.style.display !== 'none') {
        // Get the Markdown content from the textarea
        const markdownContent = textarea.value;

        // Render the Markdown content to HTML
        const renderedHtml = marked.parse(markdownContent);

        // Update the div with the rendered HTML
        div.innerHTML = renderedHtml;

        // Hide the textarea and show the div
        textarea.style.display = 'none';
        div.style.display = 'block';

        // Set aria-hidden to true for the textarea and false for the div
        textarea.setAttribute('aria-hidden', 'true');
        div.removeAttribute('aria-hidden');
    } else {
        // Hide the div and show the textarea
        div.style.display = 'none';
        textarea.style.display = 'block';

        // Set aria-hidden to true for the div and false for the textarea
        div.setAttribute('aria-hidden', 'true');
        textarea.removeAttribute('aria-hidden');
    }
}


//------------- mermaid

function toggleMermaidDiagram(targetID,btnID) {
    const textareaId = 'textarea-' + targetID;
    const textarea = document.getElementById(textareaId);
    const preId = 'pre-' + targetID;
    let pre = document.getElementById(preId);

    const btn = document.getElementById(btnID);
    // Toggle the 'active' class on or off of the element in the variable 'btn'
    btn.classList.toggle('active');

    if (textarea.style.display !== 'none') {
        // Update the pre tag with the content of the textarea
        pre.textContent = textarea.value;

        // Hide the textarea and show the pre tag
        textarea.style.display = 'none';
        pre.style.display = 'block';
        textarea.setAttribute('aria-hidden', 'true');
        pre.removeAttribute('aria-hidden');

        // Render Mermaid diagram
        mermaid.run();
    } else {
        // Hide the pre tag and show the textarea
        pre.textContent = '';
        pre.style.display = 'none';
        // reset this so that the diagram renders again next time
        pre.removeAttribute('data-processed');

        // Set aria-hidden to true for the pre tag
        pre.setAttribute('aria-hidden', 'true');
        textarea.removeAttribute('aria-hidden');
        // pre.data-processed="false";
        textarea.style.display = 'block';
    }
}

// ------------------------------------------------------------------ 
//  Export Functions
// ------------------------------------------------------------------ 
// Concatenate all items with printfmted or printfillin class, put them in a separate div
//  that is only visible for printing and print 
async function printContent(className) {
    // Select all div elements with the specified class
    const contentDivs = document.querySelectorAll(`.${className}`);

    // Initialize a variable to hold the concatenated content
    let concatenatedContent = '';

    // Function to process each div
    function processDiv(div) {
        return new Promise((resolve) => {
            // Check if the div has a data-previewfx attribute
            const previewFunctionName = div.getAttribute('data-previewfx');
            if (previewFunctionName) {
                // Extract the part of the element's id after the '-'
                const id = div.id.split('-')[1];

                // Call the function in the data-previewfx attribute with the idSuffix
                const previewFunction = window[previewFunctionName];
                if (div.getAttribute('aria-hidden') === 'true' && typeof previewFunction === 'function') {
                    previewFunction(id, id + '-preview');

                    // Wait for the preview function to complete
                    setTimeout(() => {
                        resolve();
                    }, 100); // Adjust the delay as necessary
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        }).then(() => {
            // Append the content of the div to the concatenated content
            concatenatedContent += div.innerHTML;
        });
    }

    // Process each div sequentially
    for (const div of contentDivs) {
        await processDiv(div);
    }

    // After all content is concatenated, do something with it
    // Example: Set the content of a preview element
    const combinedPreviewDiv = document.getElementById('combined-preview');
    combinedPreviewDiv.innerHTML = concatenatedContent;

    // Make the combined-preview div visible for printing
    combinedPreviewDiv.style.display = 'block';

    // Trigger the print preview of the browser
    window.print();
}
// Hide the combined-preview div after printing
// combinedPreviewDiv.style.display = 'none';
// easymde1.togglePreview();
// easymde2.togglePreview();

// Function to combine text content of all textareas with a specific class on the page
//  used for both copy and download markdown versions
function combineTextAreas(className) {
    // Select all textarea elements with the specified class
    const textareas = document.querySelectorAll(`textarea.${className}`);

    // Use map to get the values of all textareas and join to concatenate them with newline characters
    const combinedText = Array.from(textareas).map(textarea => textarea.value).join('\n');

    return combinedText;
}

// Function to download combined text content as a .md file
function downloadCombinedText(classname,filename) {
    const combinedText = combineTextAreas(classname);

    // Download combined text content
    const blob = new Blob([combinedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; //'combined_text.md';
    a.click();
    URL.revokeObjectURL(url);
}


// Function to copy combined text content to the clipboard
function copyCombinedTextToClipboard(classname,btnID) {
    const combinedText = combineTextAreas(classname);

    // Copy combined text content to clipboard
    navigator.clipboard.writeText(combinedText).then(() => {
        alert('Combined text copied to clipboard!');
        const notification = document.getElementById('notification');
        notification.style.display = 'block';

        // Hide notification after a few seconds (optional)
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}



// ------------------------------------------------------------------ 
// controller listeners
// ------------------------------------------------------------------ 


// Add an event listener to the button to trigger the function on click
document.getElementById('print-btn').addEventListener('click', 
    function () { printContent("printfmted") });

// copy work to clipboad
document.getElementById('copy-btn').addEventListener('click', 
    function () {copyCombinedTextToClipboard("md-content",'copy-btn')});
// save work as md
document.getElementById('save-button').addEventListener('click', 
    function () {downloadCombinedText("md-content","workshop-notes.md")});

// printable template
document.getElementById('print-tmplt-btn').addEventListener('click',
    function () { printContent("printfillin") });

// compy template as md
document.getElementById('copy-tmplt-btn').addEventListener('click', 
    function () {copyCombinedTextToClipboard("md-template",'copy-tmplt-btn')});

// save template as md
document.getElementById('save-tmplt-btn').addEventListener('click', 
    function () {downloadCombinedText("md-template","workshop-template.md")});