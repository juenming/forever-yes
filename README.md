# Forever Yes

A romantic, interactive proposal website with playful yes/no buttons, heartfelt pages, and a sweet finale. It is a static site: no build step, server, or dependencies are needed.

## Make it yours

Edit [`config.json`](./config.json) to customize the page. You do not need to edit the HTML, JavaScript, or CSS for text and name changes.

- `siteTitle`: the browser-tab title.
- `pages`: the three screens, in order. Each has a small `label`, a `question`, a `description`, and `yes`/`no` button labels.
- `finale`: the final screen's `label`, `title`, and `description`, plus `topName`, `bottomName`, and `heart`. The name graphic's accessible label is generated automatically from the two names.
- `interactions`: the extra button messages shown as the final screen's playful no button gets smaller.

Keep the JSON syntax valid: put text in double quotes, separate entries with commas, and do not add a comma after the last entry. You can change just the values you want; any omitted setting keeps its default. The three-screen layout and button behavior are part of the page and are not configurable in `config.json`.

To preview locally, serve the project over HTTP (for example, use the **Live Server** extension in VS Code). Opening `index.html` directly as a `file://` URL may prevent the browser from loading `config.json`.

## Publish with GitHub Pages

1. Create a GitHub repository for your copy. Choose a public repository if you want anyone to be able to view the source and configuration.
2. Add the project files to the repository and push your changes.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select your branch (usually `main`) and the `/(root)` folder, then save.
5. When deployment finishes, open the site URL shown in the Pages settings. After future edits, commit and push them to publish the updated site.

GitHub Pages serves the files publicly. Anyone who can access the site can also inspect `config.json` and the source, so do not put private information, passwords, or API keys in the project.

## Support this project

A $1 coffee keeps the fun brewing :)
If you’d like to support the project, you can donate here:

[Ko-fi](https://ko-fi.com/juenming)
