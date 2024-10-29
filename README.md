# WP Update Version

**`wp-update-version`** is a command-line tool that updates the version number in various files within a WordPress project (theme or plugin). This allows you to synchronize your WP project's version number with the one in your `package.json` file.

## Features

- Updates the version number in CSS and PHP files' header comment blocks.
- Optionally updates the version as constant declaration in specified PHP files.
- Supports single or multiple files updates with one command.
- Retrieves the version number from a `package.json` file (or allows you to specify it manually)

## Installation

Save `wp-update-version` as a devDependency in your project:

```
npm install --save-dev wp-update-version
```

## Usage

Run the script directly in your terminal using `npx`:

```
npx wp-update-version --file src/theme.scss --file plugin.php --project-version 2.1.0 --constant PLUGIN_VERSION
```

Or add it to your project's [version](https://docs.npmjs.com/cli/v10/commands/npm-version) script in `package.json`:

```json lines
{
  "name": "my-wp-project",
  "version": "2.0.0",
  "scripts": {
    "build": "[compile src/theme.scss into style.css]",
    "version": "wp-update-version -f src/theme.scss && npm run build && git add ."
  }
}
```

For instance, when running `npm version minor`, the following will happen with the configuration above:

1. (npm version) Updates the version number to **2.1.0** in `package(-lock).json`
2. (wp-update-version) Updates the version number to **2.1.0** in `src/theme.scss`
3. Builds `style.css` with version number **2.1.0**
4. Commits all updated files

### Available options

| Option                              | Description                                                                                 | Default Value                    |
|-------------------------------------|---------------------------------------------------------------------------------------------|----------------------------------|
| `-f <file>` `--file <file>`         | Specify the file(s) to be updated. Can be repeated to update multiple files.                | `./style.css`, `./<dirname>.php` |
| `-p <file>` `--package-json <file>` | Specify the location of the `package.json` file.                                            | `./package.json`                 |
| `--project-version <version>`       | (Optional) Specify the new version number to apply. Overrides the value from `package.json` | -                                |
| `--constant <constant>`             | (Optional) Specify a constant declaration to be updated in the PHP file(s).                 | -                                |

## Development

### Permission issue

When building and running your own version of the command, you might need to run `chmod u+r bin/*` to allow the program to execute.

### Testing

This project uses Vitest for unit and integration testing.

- Run `npm test` for a single test suite run.
- Run `npm run test:watch` to enable test-based development.

## Contributing

If you encounter any issues or have suggestions for improvements, please feel free to open a new issue or submit a pull request.

## Credits

This tool was inspired by and derived from the following:

- [@soderlind/wp-project-version-sync](https://github.com/soderlind/wp-project-version-sync)
- [@snrankin/generate-wp-readme](https://github.com/snrankin/generate-wp-readme)
- [Node.js script to bump WordPress plugin version automatically](https://dustinparkerwebdev.com/nodejs-script-bump-wordpress-plugin-version/) (snippet)

## License

This project is licensed under the [MIT License](LICENSE).
