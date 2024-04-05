
function fetchCommitsInterval() {
    function fetchData() {
        const examplePayload = [
            {
                commit: {
                    message: "Add new feature",
                    author: {
                        name: "Bob Johnson",
                        email: "bjohnson@example.com",
                        date: "2022-01-03T15:45:00Z"
                    }
                }
            },
            {
                commit: {
                    message: "Fix bug in login feature",
                    author: {
                        name: "Jane Smith",
                        email: "janesmith@example.com",
                        date: "2022-01-02T09:30:00Z"
                    }
                }
            },
            {
                commit: {
                    message: "Initial commit",
                    author: {
                        name: "John Doe",
                        email: "johndoe@example.com",
                        date: "2022-01-01T12:00:00Z"
                    }
                }
            }
        ];

        localStorage.setItem("commits", JSON.stringify(examplePayload));
        loadCommitsFromStorage();
    }

    fetchData();
    setInterval(fetchData, getRandomInt(60000, 12000));
}

function loadCommitsFromStorage() {
    const storedCommits = localStorage.getItem('commits');
    if (storedCommits !== undefined) {
        const commits = JSON.parse(storedCommits);
        constructCommitTimeline(commits);
    }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to construct timeline items for commits
function constructCommitTimeline(commits) {
    
    const title = document.querySelector('.title') || document.createElement('h1');
    const error = document.querySelector('.error') || document.createElement('p');

    error.className = 'error';
    title.className = 'title';

    title.textContent = 'MY COMMIT TIMELINE'; 

    error.textContent = '';

    const timeline = document.getElementById('timeline');
    const commitLine = document.getElementById('commitLine');
    
    if (!timeline) {
        const newTimeline = document.createElement('div');
        newTimeline.id = 'timeline';
        commitLine.appendChild(newTimeline);
    } else {
        timeline.innerHTML = '';
    }

    
    commitLine.insertBefore(error, timeline);
    commitLine.insertBefore(title, error);

    const existingAttribution = document.querySelector('.attribution');
    if (existingAttribution) {
        existingAttribution.remove();
    } 

    if (Array.isArray(commits)) {
        
        commits.forEach((commit, index) => {
            var pointerType = getComputedStyle(document.documentElement).getPropertyValue('--pointer-type').trim();
            const container = document.createElement('div');
            container.className = index % 2 === 0 ? 'container left '+ pointerType : 'container right ' + pointerType;

            const content = document.createElement('div');
            content.className = 'content';

            // Extracting commit message and timestamp
            const message = commit.commit.message;
            const timestamp = new Date(commit.commit.author.date).toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric', 
                hour12: true 
            }); // Format timestamp

            // Constructing content with message and timestamp
            const messageParagraph = document.createElement('p');
            messageParagraph.className = 'messageText';
            messageParagraph.textContent = message;

            const timestampParagraph = document.createElement('p');
            timestampParagraph.className = 'timestampText';
            timestampParagraph.textContent = timestamp;

            content.appendChild(messageParagraph);
            content.appendChild(timestampParagraph);

            container.appendChild(content);
            timeline.appendChild(container);
            
        });
    } else {
        error.textContent = 'No commits found';
    }

}

document.addEventListener('DOMContentLoaded', function () {
    fetchCommitsInterval();
    const inputFields = document.querySelectorAll('.input-color');
    inputFields.forEach(inputField => {
        createColorPicker(inputField);
    });
});



// Function to create and position the color picker pseudo-element
function createColorPicker(inputField) {
    
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';

    
    colorPicker.style.position = 'absolute';
    colorPicker.style.right = '5px'; 
    colorPicker.style.top = '50%';
    colorPicker.style.transform = 'translateY(-50%)';
    colorPicker.style.height = '20px'; 

    
    colorPicker.addEventListener('change', function() {
        const hexColor = colorPicker.value; 
        const rgbColor = hexToRgb(hexColor); 
        inputField.value = rgbColor; 
    });

    
    // Get the label element associated with the input field
    const label = inputField.parentNode.querySelector('label');
    // Append the color picker to the label
   
    label.appendChild(colorPicker);
}


function hexToRgb(hex) {
    
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `(${r},${g},${b})`;
}










