// import mermaid from ';
mermaid.initialize({ startOnLoad: false });

// tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


// ------------------------------------------------------------------ 
//  Render the prompts
// ------------------------------------------------------------------ 
// Select all div elements with the class 'prompt'
const promptList = document.querySelectorAll('.md-source-group');

// Loop through each div with class 'prompt'
promptList.forEach(prompt => {
    
    const anchorId = prompt.getAttribute('data-md-group-id');
    
    const labelElement = document.getElementById(`render-${anchorId}`);
    const promptElement = document.getElementById(`src-${anchorId}`);
    

    // Get the Markdown text from the textarea
    const markdownText = promptElement.value;

    // Parse the Markdown text into HTML using marked.parse
    const htmlContent = marked.parse(markdownText);



    // Set the innerHTML of the <p> element to the parsed HTML content
    labelElement.innerHTML = htmlContent;
});

// ------------------------------------------------------------------ 
//  Preview functions
// ------------------------------------------------------------------ 

function toggleHTML(targetID,btnID) {

    const textareaId = 'input-' + targetID;
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

// ------------- date

function insertDate(targetID){
    const dateInput = document.getElementById(targetID);
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]; 
    dateInput.value = today;
}


function toggleDate(targetID, btnID) {
    // get elements needed
    const dateInputID = 'input-' + targetID
    const dateInput = document.getElementById(dateInputID);

    const previewId = 'html-' + targetID; // Get current date in YYYY-MM-DD format
    const previewDiv = document.getElementById(previewId);
    console.log(dateInput)
    // Check if the date input value is not set or is empty
    if (!dateInput.value) {
        // Call the insertDate function with the targetID
        insertDate(dateInputID);
    }
    // Toggle the 'active' class on or off of the element in the variable 'btn'
    const btn = document.getElementById(btnID);
    btn.classList.toggle('active');
    // querySelector('input[type="date"]');

    if (dateInput.style.display !== 'none') {
        // if in text mode, switch to preview
        dateInput.style.display = 'none'
        previewDiv.style.display = 'block';
        previewDiv.innerHTML =  dateInput.value ;
    } else {
        // in preview, set to text
        dateInput.style.display = 'block'
        previewDiv.style.display = 'none';
    }
}

//------------- mermaid

function toggleMermaidDiagram(targetID,btnID) {
    const textareaId = 'input-' + targetID;
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
                    }, 100); 
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

    // After all content is concatenated put it in combined box
    const combinedPreviewDiv = document.getElementById('combined-preview');
    combinedPreviewDiv.innerHTML = concatenatedContent;

    // Trigger the print preview of the browser
    window.print();
}

// Function to combine text content of all textareas with a specific class on the page
//  used for both copy and download markdown versions
function combineTextValues(className) {
    // Select all textarea elements with the specified class
    const elements = document.querySelectorAll(`textarea.${className} , input.${className}`);

    // Use map to get the values of all textareas and join to concatenate them with newline characters
    const combinedText = Array.from(elements).map(element => element.value).join('\n');

    return combinedText;
}

// Function to download combined text content as a .md file
function downloadCombinedText(classname,filename) {
    const combinedText = combineTextValues(classname);

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
    const combinedText = combineTextValues(classname);
    const btn = document.getElementById(btnID);

    const tooltip = bootstrap.Tooltip.getInstance(btn) || new bootstrap.Tooltip(btn);
    const originalTitle = btn.getAttribute('data-bs-original-title');
    // const notificationID = 'notification-' + btnID

    // Copy combined text content to clipboard
    navigator.clipboard.writeText(combinedText).then(() => {
        // notify with check mark and tooltip
        tooltip.setContent({ '.tooltip-inner': 'Copied!' });
        tooltip.show();
        btn.querySelector('i').className = 'fa-solid fa-check';

        // Return button to original state after a few seconds
        setTimeout(() => {
            btn.setAttribute('data-bs-original-title', originalTitle);
            tooltip.setContent({ '.tooltip-inner': originalTitle });
            btn.querySelector('i').className = 'fas fa-copy';
            tooltip.hide();
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