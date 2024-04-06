import generateCommitLine from './commit-line.js';


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
        errorToast("Invalid GitHub Repository URL", "Please enter a valid GitHub Repository URL");
    }
}

function extractGitHubInfo(url) {
    const parts = url.split('/');
    const username = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    return { username, repo };
}


function sucessToast(title, text){
    createToast('success', 'fa-solid fa-check-circle', title, text);
}

function errorToast(title, text){
    createToast('error', 'fa-solid fa-exclamation-circle', title, text);
}

function createToast(type, icon, title, text){
    const notifications = document.getElementById('notifications');
    let newToast = document.createElement('div');
    newToast.innerHTML = `
        <div class="toast ${type}">
            <i class="${icon}"></i>
            <div class="contentz">
                <div class="titlez">${title}</div>
                <span>${text}</span>
            </div>
            <i class="fa-solid fa-xmark" onclick="(this.parentElement).remove()"></i>
        </div>`;
    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(
        ()=>newToast.remove(), 5000
    )
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

            generateCommitLine(repositoryURL, "timeline", "commitLine", 60000);

            if (theme !== null && theme !== '' && theme !== undefined) {
                decompress(theme);
            }

            if (hvisible === '0') {
                document.getElementById('heading').style.display = 'none';
            }

            
        } else {
            errorToast("Invalid GitHub Repository URL", "Please enter a valid GitHub Repository URL");
            const errorElement = document.querySelector('.error');
            if (errorElement) {
                errorElement.textContent = 'Invalid GitHub Repository URL';
            }
        }
    }
});


document.getElementById('updateLink').addEventListener('click', updateRepo);
document.getElementById('shareURL').addEventListener('click', () => checkIfGenerated(shareURL));
document.getElementById('shareIFrame').addEventListener('click', () => checkIfGenerated(shareIFrame));
document.getElementById('copyCode').addEventListener('click', () => checkIfGenerated(copyCode));
document.getElementById('changeTheme').addEventListener('click', changeTheme);
document.getElementById('openThemeForum').addEventListener('click', openThemeForum);

function checkIfGenerated(functionName) {
    const urlParams = new URLSearchParams(window.location.search);
    const repositoryURL = urlParams.get('url');

    if (repositoryURL !== null) {
        functionName();

  
    } else {
        errorToast("Repository not generated", "Please generate first");
    }
}


function copyCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const repositoryURL = urlParams.get('url');
    const theme = document.getElementById('theme').value;

    if (theme !== null && theme !== '' && theme !== undefined) {
        var decoded = atob(theme);
        var compressed = new Uint8Array(decoded.length);
        for (var i = 0; i < decoded.length; i++) {
        compressed[i] = decoded.charCodeAt(i);
        }
        var decompressed = pako.inflate(compressed, { to: 'string' });
        var themeProperties = decompressed.split('$');

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
        "--pointer-size-arrow",
        "--vertical-ruler-thickness",
        "--vertical-ruler-color-start",
        "--vertical-ruler-color-start-alpha",
        "--vertical-ruler-color-end",
        "--vertical-ruler-color-end-alpha",
        "--dot-size",
        "--dot-border-radius",
        "--pointer-position",
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
        var styleString = '';
        variableNames.forEach(function(variableName, index) {
            styleString += `${variableName}: ${themeProperties[index]}; `;
    });

    var StyleStr = `
    <style>
        :root {
            ${styleString}
        }
    </style>
    `;

    } else {
        var StyleStr = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Aizhee/Commit-Line/css/variables.css">`
    }

    navigator.clipboard.writeText(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Aizhee/Commit-Line/css/base-theme.css">
        ` + StyleStr + `

        <div id="commitLine">
            <div id="timeline"></div>
        </div>
        
        <script type="module">
            import generateCommitLine from 'https://cdn.jsdelivr.net/gh/Aizhee/Commit-Line/js/commit-line.js'
            generateCommitLine('`+ repositoryURL +`', "timeline", "commitLine", 20000)
        </script>
    `)
    .then(() => {
        sucessToast("Copied!", "Successfully copied Code")
      })
      .catch((e) => {
        errorToast("Something went wrong", e);
      });
}

function shareIFrame() {
    hideHeading()
    const urls = window.location.href;
    navigator.clipboard.writeText(`<iframe src="${urls}" width="100%" height="100%" style="border: none;"></iframe>`)
    .then(() => {
        sucessToast("Copied!", "Successfully copied IFrame")
        showHeading()
      })
      .catch((e) => {
        errorToast("Something went wrong", e);
        showHeading()
      });
    
}

function shareURL() {
    hideHeading()
    const urls = window.location.href;
    navigator.clipboard.writeText(urls)
    .then(() => {
        sucessToast("Copied!", "Successfully copied URL")
        showHeading()
      })
      .catch((e) => {
        errorToast("Something went wrong", e);
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

function openThemeForum() {
    window.open('https://github.com/Aizhee/Commit-Line/discussions/1', '_blank');
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
      "--pointer-size-arrow",
      "--vertical-ruler-thickness",
      "--vertical-ruler-color-start",
      "--vertical-ruler-color-start-alpha",
      "--vertical-ruler-color-end",
      "--vertical-ruler-color-end-alpha",
      "--dot-size",
      "--dot-border-radius",
      "--pointer-position",
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



