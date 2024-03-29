function extractGitHubInfo(url) {
    const parts = url.split('/');
    const username = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    return { username, repo };
}

// Function to update repository based on input URL
function updateRepo(username, repo) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('url', repositoryURL); 
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    loadCommitsFromStorage();
    fetchCommitsInterval(username, repo);
    document.getElementById('repository').textContent = repositoryURL;
    document.querySelector('.error').textContent = '';

}

// Function to fetch commits from GitHub
async function fetchCommits(username, repo) {
    const headers = new Headers();
    
    const defaultUserAgent = navigator.userAgent;
    let useragent = defaultUserAgent;

    headers.append('User-Agent', useragent);
    
    const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
        headers: headers
    });
    if (!response.ok) {
        useragent = randomUseragent.getRandom();
        headers.set('User-Agent', useragent);
        return fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
            headers: headers
        });
    }
    return await response.json();
}

const timeline = document.getElementById('timeline');

// Function to construct timeline items for commits
function constructCommitTimeline(commits) {
    
    timeline.innerHTML = ''; // Clear existing content

    commits.forEach((commit, index) => {
        const container = document.createElement('div');
        container.className = index % 2 === 0 ? 'container left' : 'container right';

        const content = document.createElement('div');
        content.className = 'content';

        // Extracting commit message and timestamp
        const message = commit.commit.message;
        const timestamp = new Date(commit.commit.author.date).toLocaleString(); // Format timestamp

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
}


// Function to fetch commits at intervals
function fetchCommitsInterval(username, repo) {
  

    function fetchData() {
        fetchCommits(username, repo) // Pass username and repo
            .then(commits => {
                // Store fetched data in local storage
                localStorage.setItem('commits', JSON.stringify(commits));
                constructCommitTimeline(commits);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                    setTimeout(fetchData, getRandomInt(10000, 20000));
            });
    }

    fetchData();
    setInterval(fetchData, getRandomInt(10000, 20000));
}

function getRandomInt(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to load commits from local storage
function loadCommitsFromStorage() {
    const storedCommits = localStorage.getItem('commits');
    if (storedCommits) {
        const commits = JSON.parse(storedCommits);
        constructCommitTimeline(commits);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const repositoryURL = urlParams.get('url'); 
    if (repositoryURL) {
        const { username, repo } = extractGitHubInfo(repositoryURL);
        if (username && repo) {
            loadCommitsFromStorage();
            fetchCommitsInterval(username, repo);
        } else {
            timeline.innerHTML = ''; // Clear existing content
            document.querySelector('.error').textContent = 'Invalid GitHub Repository URL';
        }
    }
});

