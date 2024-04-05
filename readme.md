[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# Commit-Line
[![SVDZF.png](https://s9.gifyu.com/images/SVDZF.png)](https://gifyu.com/image/SVDZF)
Commit-Line is a customizable timeline generator for public GitHub repositories. It automatically updates to reflect the latest commits made to the repository. With Commit-Line, you can create a dynamic timeline of your project's development history and share it easily via a shareable link, iframe, or HTML code snippet.

[![SVDCU.gif](https://s12.gifyu.com/images/SVDCU.gif)](https://gifyu.com/image/SVDCU)
[![SVD5y.png](https://s12.gifyu.com/images/SVD5y.png)](https://gifyu.com/image/SVD5y)
## Features

- **Dynamic Timeline**: Generates a timeline based on the commit history of a public GitHub repository.
- **Auto Updates**: Automatically updates to reflect the latest commits in the repository.
- **Customizable**: Customize the appearance and behavior of the timeline to suit your needs.
[![SVDVT.gif](https://s12.gifyu.com/images/SVDVT.gif)](https://gifyu.com/image/SVDVT)
[![SVDDO.png](https://s12.gifyu.com/images/SVDDO.png)](https://gifyu.com/image/SVDDO)
- **Shareable**: Easily share your timeline using a shareable link, iframe, or HTML code snippet.
[![SVDVj.png](https://s9.gifyu.com/images/SVDVj.png)](https://gifyu.com/image/SVDVj)
- **Responsive**: Adjusts to screen size.
[![SVDoH.png](https://s12.gifyu.com/images/SVDoH.png)](https://gifyu.com/image/SVDoH)
## Usage (Demo)

1. **Input GitHub Repository**: Provide the URL of the public GitHub repository you want to generate the timeline for.
2. **Customize Timeline**: Customize the appearance and behavior of the timeline using available options.
3. **Generate Timeline**: Generate the timeline and choose your preferred sharing method.
4. **Share**: Share your timeline via a shareable link, iframe, or HTML code snippet.

## Usage (Commit-Line Js Library)

1. **Import Default Theme CSS**: 
```html 
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Aizhee/Commit-Line/css/base-theme.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Aizhee/Commit-Line/css/variables.css">
```
2. **Add two elements with uqique ID's**: In this case, an inner div with the ID ```timeline``` and an outer div ```commitLine```
```html
<div id="commitLine">
    <div id="timeline"></div>
</div>
```
3. **Import Javascript Library**:  
```javascript
import generateCommitLine from 'https://cdn.jsdelivr.net/gh/Aizhee/Commit-Line/js/commit-line.js'
```
4. **Call generateCommitLine**:  
```javascript

generateCommitLine ('your-repository-url', "innerElementID", "outerElementID", Fetch-delay-Miliseconds, 'Locale', timestampFormat)

```
## Documentation for `generateCommitLine` function
| Parameter | Description | Type |
|-----------|-------------|------|
| repositoryURL | The URL of the GitHub repository. | String |
| timelineContainerID | The ID of the timeline container element. | String |
| commitlineContainerID | The ID of the commit line container element. | String |
| delay | The recommended delay between each fetch of commits is at least 60000 milliseconds (one minute) to avoid overusing GitHub's [REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28). | Int |
| locale | The locale to use for formatting timestamps. |  String |
| timestampFormat | The format to use for displaying timestamps using toLocaleString(). [learn more](https://www.w3schools.com/jsref/jsref_tolocalestring.asp)| Array |

```javascript
generateCommitLine(repositoryURL, timelineContainerID, commitlineContainerID, delay, locale, timestampFormat) 
```

## Example

```html
<!--
    This HTML file demonstrates the usage of the Commit-Line library.
    It includes the necessary CSS and JavaScript files and initializes the commit line.

    Usage:
    1. Include the base-theme.css and variables.css stylesheets from the CDN.
    2. Create a div element with the id "commitLine" to contain the commit line.
    3. Inside the "commitLine" div, create another div element with the id "timeline" to display the timeline.
    4. Import the generateCommitLine function from the commit-line.js file using the ES6 module syntax.
    5. Define the timestampFormat object to specify the format of the timestamps to be displayed.
    6. Call the generateCommitLine function with the following parameters:
        - The GitHub repository URL.
        - The id of the timeline div.
        - The id of the commitLine div.
        - The interval (in milliseconds) between each commit update.
        - The locale string for the timestamp format.
        - The timestampFormat object.

    Note: Make sure to replace the GitHub repository URL with your own.
-->

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Aizhee/Commit-Line/css/base-theme.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Aizhee/Commit-Line/css/variables.css">
</head>
<body>
    <div id="commitLine">
        <div id="timeline"></div>
    </div>
    
    <script type="module">
        import generateCommitLine from 'https://cdn.jsdelivr.net/gh/Aizhee/Commit-Line/js/commit-line.js'
        timestampFormat = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
        };
        generateCommitLine('https://github.com/Aizhee/Commit-Line', "timeline", "commitLine", 60000, 'en-US', timestampFormat)
    </script>
</body>
</html>
```

## Demo

You can try out Commit-Line with our live demo [here](https://aizhee.github.io/Commit-Line/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for providing access to repository data.

---

Feel free to fork this repository and customize it according to your needs. If you have any questions or suggestions, please don't hesitate to reach out.

Happy coding! 🚀
