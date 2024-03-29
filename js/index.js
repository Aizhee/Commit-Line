
import randomUseragent from 'https://cdn.jsdelivr.net/npm/random-useragent@0.5.0/+esm'

function extractGitHubInfo(url) {
    const parts = url.split('/');
    const username = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    return { username, repo };
}

// Function to update repository based on input URL
function updateRepo() {
    const repositoryURL = document.getElementById('repository').value;
    const { username, repo } = extractGitHubInfo(repositoryURL);
    if (username && repo) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('url', repositoryURL);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
        fetchCommits(username, repo);
    } else {
        document.querySelector('.error').textContent = 'Invalid GitHub Repository URL';
    }
}

// Function to fetch commits from GitHub
function fetchCommits(username, repo) {
    const headers = new Headers();

    const defaultUserAgent = navigator.userAgent;
    let useragent = defaultUserAgent;

    headers.append('User-Agent', useragent);

    fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
        headers: headers
    })
        .then(response => {
            if (!response.ok) {
                useragent = getRandomUserAgent();

                headers.set('User-Agent', useragent);
                return fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
                    headers: headers
                });
            }
            return response.json();
        })
        .then(commits => {
            constructCommitTimeline(commits, repo);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to construct timeline items for commits
function constructCommitTimeline(commits, repo) {
    const title = document.createElement('h1');
    const error = document.createElement('p');

    error.className = 'error';
    title.className = 'title';

    title.textContent = repo; 

    error.textContent = '';

    const timeline = document.getElementById('timeline');
    timeline.innerHTML = ''; 

    const commitLine = document.getElementById('commitLine');

    
    commitLine.insertBefore(error, timeline);
    commitLine.insertBefore(title, error);

    const attribution = document.createElement('p');
    attribution.style.color = 'rgba(75, 74, 74, 0.432)';
    attribution.style.textAlign = 'center';
    attribution.style.position = 'relative';
    attribution.class='attribution';
    attribution.style.bottom = '0';
    attribution.style.width = '100%';
    attribution.innerHTML = 'Generated with: <a href="https://aizhee.github.io/Commit-Line/" style="text-decoration: none;color: #2600ff4e;">Commit-Line</a> | Made with ❤️ by: <a href="https://github.com/Aizhee" style="text-decoration: none;color: #2600ff4e;">Aizhe</a>';

    commitLine.appendChild(attribution);

    if (Array.isArray(commits)) {
        
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
    } else {
        error.textContent = 'No commits found';
    }

}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const repositoryURL = urlParams.get('url');
    if (repositoryURL) {
        const { username, repo } = extractGitHubInfo(repositoryURL);
        if (username && repo) {
            fetchCommits(username, repo);
        } else {
            document.querySelector('.error').textContent = 'Invalid GitHub Repository URL';
        }
    }
});

function getRandomUserAgent() {
    const userAgent = randomUseragent.getRandom();
     console.log(userAgent);
    return userAgent;
}


document.getElementById('updateLink').addEventListener('click', updateRepo);
document.getElementById('shareURL').addEventListener('click', updateRepo);
document.getElementById('shareIFrame').addEventListener('click', updateRepo);
document.getElementById('copyCode').addEventListener('click', updateRepo);
document.getElementById('changeTheme').addEventListener('click', changeTheme);

// Function to change theme by updating CSS URLs
function changeTheme() {
    const themes = [
        { name: ' Theme: theme1 ', url: 'https://example.com/theme1.css' },
        { name: ' Theme: theme2 ', url: 'css/lightTheme.css' },
        { name: ' Theme: theme3 ', url: 'https://example.com/theme3.css' }
    ];

    document.getElementById('changeTheme').textContent = 'Changing theme...';

    const styleSheet = document.getElementById('themeStyleSheet');
    const currentURL = styleSheet.href;
    const currentIndex = themes.findIndex(theme => theme.url === currentURL);
    console.log(currentURL);
    console.log(currentIndex);

    if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % themes.length;
        styleSheet.href = themes[nextIndex].url;

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('theme', themes[nextIndex].name);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);

        document.getElementById('changeTheme').innerHTML = '<svg height="15" width="15" fill="#ffffff" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M392.26 1042.5c137.747-57.67 292.85-15.269 425.873 116.217l4.394 4.833c116.656 146.425 149.5 279.119 97.873 394.237-128.85 287.138-740.692 328.77-810.005 332.504L0 1896.442l61.953-91.83c.989-1.539 105.013-158.728 105.013-427.192 0-141.811 92.6-279.558 225.294-334.92ZM1728.701 23.052c54.923-1.099 99.96 15.268 135.111 49.43 40.643 40.644 58.109 87.877 56.021 140.603C1908.85 474.52 1423.33 953.447 1053.15 1280.79c-24.276-64.81-63.711-136.21-125.335-213.102l-8.787-9.886c-80.078-80.187-169.163-135.11-262.423-161.473C955.276 558.002 1460.677 33.927 1728.701 23.052Z" fill-rule="evenodd"></path> </g></svg>' + themes[nextIndex].name;
    
    } else if (currentIndex === -1) {
        styleSheet.href = themes[0].url;
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('theme', themes[0].name);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    }
}