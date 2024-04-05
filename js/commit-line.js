export default function generateCommitLine(repositoryURL, timelineContainerID, commitlineContainerID, delay, locale, timestampFormat) {
    document.addEventListener('DOMContentLoaded', function () {
    const { username, repo } = extractGitHubInfo(repositoryURL);
            if (username && repo) {
                fetchCommitsInterval(username, repo, delay, timelineContainerID, commitlineContainerID, locale, timestampFormat);
            } else {
                showErrorMessage('Invalid GitHub repository URL');
            }
    });
}

function extractGitHubInfo(url) {
    const parts = url.split('/');
    const username = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    return { username, repo };
}

function fetchCommits(username, repo) {
    const headers = new Headers();

    const defaultUserAgent = navigator.userAgent;
    let useragent = defaultUserAgent;

    headers.append('User-Agent', useragent);
    console.log('fetching commits');
    return fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
        headers: headers
    })
    .then(async response => {
        if (!response.ok) {
            if (response.status === 403) {
                console.error('Error 403: Forbidden');
                return Promise.reject(response.statusText);
            } else {
                console.error('Error fetching data:', response);
                return Promise.reject(response.statusText);
            }
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        return Promise.reject(error);
    });
}

function fetchCommitsInterval(username, repo, miliseconds, timelineContainerID, commitlineContainerID, locale, timestampFormat) {
    function fetchData() {
        fetchCommits(username, repo)
        .then(commits => {
            localStorage.removeItem('commits');
            localStorage.setItem('commits', JSON.stringify(commits));
            loadCommitsFromStorage(repo, timelineContainerID, commitlineContainerID, locale, timestampFormat);
        })
        .catch(error => {
            if (error === 'Forbidden') {
                loadCommitsFromStorage(repo, timelineContainerID, commitlineContainerID, locale, timestampFormat);
            } else {
                showErrorMessage('Error fetching data. Please try again later. Error: ' + error);
            }
        });
    }
    fetchData();
    setInterval(fetchData, miliseconds);
}

function showErrorMessage(message) {
    const errorElement = document.querySelector('.error');
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        const error = document.createElement('p');
        error.className = 'error';
        error.textContent = message;
        document.body.appendChild(error);
    }

}

function loadCommitsFromStorage(repo, timelineContainerID, commitlineContainerID, locale, timestampFormat) {
    const storedCommits = localStorage.getItem('commits');
    if (storedCommits !== undefined) {
        const commits = JSON.parse(storedCommits);
        constructCommitTimeline(commits, repo, timelineContainerID, commitlineContainerID, locale, timestampFormat);
    } else {
        console.error('403 Forbidden error occurred, and no commits found in local storage');
    }
}


function constructCommitTimeline(commits, repo, timelineContainerID, commitlineContainerID, locale, timestampFormat) {
    
    const title = document.querySelector('.title') || document.createElement('h1');
    const error = document.querySelector('.error') || document.createElement('p');

    error.className = 'error';
    title.className = 'title';

    title.textContent = ''; 
    title.textContent = repo; 

    error.textContent = '';

    const timeline = document.getElementById(timelineContainerID);
    const commitLine = document.getElementById(commitlineContainerID);
    
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

    if (!document.querySelector('.attribution')) {
        const attribution = document.createElement('p');
        attribution.className = 'attribution';
        attribution.innerHTML = '';
        
        attribution.style.color = 'rgba(75, 74, 74, 0.432)';
        attribution.style.textAlign = 'center';
        attribution.style.position = 'relative';
        attribution.style.bottom = '0';
        attribution.style.width = '100%';
        attribution.innerHTML = 'Generated with: <a href="https://aizhee.github.io/Commit-Line/" style="text-decoration: none;color: #2600ff4e;">Commit-Line</a> | Made with ❤️ by: <a href="https://github.com/Aizhee" style="text-decoration: none;color: #2600ff4e;">Aizhe</a>';

        commitLine.appendChild(attribution);
    }

    if (Array.isArray(commits)) {
        
        commits.forEach((commit, index) => {
            var pointerType = getComputedStyle(document.documentElement).getPropertyValue('--pointer-type').trim();
            const container = document.createElement('div');
            container.className = index % 2 === 0 ? 'container left ' + pointerType : 'container right ' + pointerType;

            const content = document.createElement('div');
            content.className = 'content';

            const message = commit.commit.message;

            if (!locale) {
                locale = 'en-US';
            }
        
            if (!timestampFormat) {
                timestampFormat = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                };
            }

            const timestamp = new Date(commit.commit.author.date).toLocaleString(locale, timestampFormat); 

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




