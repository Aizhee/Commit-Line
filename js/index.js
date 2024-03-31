
import randomUseragent from 'https://cdn.jsdelivr.net/npm/random-useragent@0.5.0/+esm'

function extractGitHubInfo(url) {
    const parts = url.split('/');
    const username = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    return { username, repo };
}

// Function to update repository based on input URL
function updateRepo() {
    const theme = document.getElementById('theme').value;
    const repositoryURL = document.getElementById('repository').value;
    const { username, repo } = extractGitHubInfo(repositoryURL);
    if (username && repo) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('url', repositoryURL);
        urlParams.set('theme', theme);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
        location.reload(true);

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
    console.log('fetching commits');
    return fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
        headers: headers
    })
        .then(async response => {
            if (!response.ok) {
                useragent = getRandomUserAgent();
                console.log(useragent);
                headers.set('User-Agent', useragent);

                let response;
                let iterationCount = 0;

                do {
                    response = await fetchCommitsAsync(username, repo, headers);
                    await new Promise(resolve => setTimeout(resolve, 60000));
                    iterationCount++;
                } while (!response.ok && iterationCount < 5);

                if (iterationCount === 5) {
                    const storedCommits = localStorage.getItem('commits');
                    if (storedCommits !== undefined) {
                        const commits = JSON.parse(storedCommits);
                        return commits;
                    }
                }

                return response.json();
            }

            async function fetchCommitsAsync(username, repo, headers) {
                return await fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
                    headers: headers
                });
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loadCommitsFromStorage(repo);
        });
}

function fetchCommitsInterval(username, repo) {


    function fetchData() {
         fetchCommits(username, repo) // Pass username and repo
             .then(commits => {
                 // Store fetched data in local storage
                 localStorage.removeItem('commits');
                 console.log('deleted local storage');
                 localStorage.setItem('commits', JSON.stringify(commits));
                 loadCommitsFromStorage(repo);
             })
             .catch(error => {
                 console.error('Error fetching data:', error);
                 document.querySelector('.error').textContent = 'Error fetching data';
             });
            }
    fetchData();
    setInterval(fetchData, getRandomInt(60000, 12000));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to load commits from local storage
function loadCommitsFromStorage(repo) {
    console.log('reading local storage');
    const storedCommits = localStorage.getItem('commits');
    if (storedCommits !== undefined) {
        const commits = JSON.parse(storedCommits);
        constructCommitTimeline(commits, repo);
    }
}

// Function to construct timeline items for commits
function constructCommitTimeline(commits, repo) {
    
    const title = document.querySelector('.title') || document.createElement('h1');
    const error = document.querySelector('.error') || document.createElement('p');

    error.className = 'error';
    title.className = 'title';

    title.textContent = ''; 
    title.textContent = repo; 

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
    const urlParams = new URLSearchParams(window.location.search);
    const repositoryURL = urlParams.get('url');
    const theme = urlParams.get('theme');
    const hvisible = urlParams.get('hvisible');

    if (repositoryURL) {
        const { username, repo } = extractGitHubInfo(repositoryURL);
        if (username && repo) {
            const repositoryURLElement = document.getElementById('repository');
            repositoryURLElement.value = repositoryURL;
            const themeElement = document.getElementById('theme');
            themeElement.value = theme;
            fetchCommitsInterval(username, repo);

            if (theme !== null) {
                decompress(theme);
            }

            if (hvisible === '0') {
                doc
                ument.getElementById('heading').style.display = 'none';
            }
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
document.getElementById('shareURL').addEventListener('click', shareURL);
document.getElementById('shareIFrame').addEventListener('click', shareIFrame);
document.getElementById('copyCode').addEventListener('click', updateRepo);
document.getElementById('changeTheme').addEventListener('click', changeTheme);

function shareIFrame() {
    hideHeading()
    const urls = window.location.href;
    navigator.clipboard.writeText(`<iframe src="${urls}" width="100%" height="100%" style="border: none;"></iframe>`)
    .then(() => {
        alert("Successfully copied IFrame");
        showHeading()
      })
      .catch((e) => {
        alert("Something went wrong",e);
        showHeading()
      });
    
}

function shareURL() {
    hideHeading()
    const urls = window.location.href;
    navigator.clipboard.writeText(urls)
    .then(() => {
        alert("Successfully copied URL");
        showHeading()
      })
      .catch((e) => {
        alert("Something went wrong",e);
        showHeading()
      });
}

function hideHeading() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('hvisible', 0);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
}

function showHeading() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('hvisible', 1);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
}

function changeTheme() {
    window.open('designer.html', '_self');
}

function decompress(input) {
    var decoded = atob(input);
    var compressed = new Uint8Array(decoded.length);
    for (var i = 0; i < decoded.length; i++) {
      compressed[i] = decoded.charCodeAt(i);
    }
    var decompressed = pako.inflate(compressed, { to: 'string' });
    var themeProperties = decompressed.split('$');
    updateCSSVariables(themeProperties);

  }

  function updateCSSVariables(valuesArray) {
    var root = document.documentElement;
    var variableNames = [
      "--primary-color",
      "--secondary-color",
      "--background-color-property",
      "--background-transparency",
      "--text-color-title",
      "--text-color-primary",
      "--text-color-secondary",
      "--content-background-color",
      "--content-background-color-alpha",
      "--content-border-color",
      "--content-border-radius",
      "--content-border-width",
      "--content-border-style",
      "--content-max-width",
      "--content-padding",
      "--font-family-global",
      "--margin-top-time",
      "--font-size-title",
      "--font-size-commit-message",
      "--font-size-commit-time",
      "--font-weight-title",
      "--font-weight-commit-message",
      "--font-weight-commit-time",
      "--pointer-type",
      "--branch-color",
      "--branch-thickness",
      "--branch-width",
      "--ponter-size-arrow",
      "--vertical-ruler-thickness",
      "--vertical-ruler-color-start",
      "--vertical-ruler-color-start-alpha",
      "--vertical-ruler-color-end",
      "--vertical-ruler-color-end-alpha",
      "--dot-size",
      "--dot-border-radius",
      "--ponter-poition",
      "--dot-box-shadow-color",
      "--dot-box-shadow-color-alpha",
      "--horizontal-shadow",
      "--vertical-shadow",
      "--blur-radius",
      "--transition-property-seconds",
      "--transition-property-bezier-curve",
      "--hover-content-background-color",
      "--hover-content-background-color-alpha",
      "--hover-content-border-color",
      "--content-text-gradient-background",
      "--content-text-fill-color",
      "--hover-content-border-style",
      "--hover-content-border-radius",
      "--hover-content-border-width",
      "--hover-content-padding",
      "--hover-box-shadow-color-main",
      "--hover-box-shadow-color-main-alpha",
      "--content-horizontal-shadow",
      "--content-vertical-shadow",
      "--content-blur-radius",
    ];

    variableNames.forEach(function(variableName, index) {
        root.style.setProperty(variableName, valuesArray[index]);
    });
}



