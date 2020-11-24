# 👋 Holi

Use holi to organize your thoughts in your new tab page or manage your bookmarks
with a simple, minimal sidebar.

![Main application][1]<br />
[![Download Holi from Chrome Web Store][7]][2]<br />

## Features

- Native dark mode
- Pure markdown text
- Synchronized with your Chrome account
- Access you bookmarks from a minimal sidebar
- Use extra editor elements, like checkboxes, smart links, or emojis 🎉

## Contributing

When contributing to this repository, please first discuss the change you wish
to make with the owners of this repository via issue, email, or any other method
before making a change.

### Making changes

This extension should work both in Google Chrome and Firefox. However, the
extension manifests are slightly different. For debugging purposes, a symlink
to the proper manifest can be created:

`ln -s manifest.[chrome|firefox].json manifest.json`

There is no build process, just make your changes and reload the extension.

### Development documentation

- [Chrome Extension Development][3].
- [Firefox Add-ons Development][6]

## Thanks to

- [CodeMirror][4]
- [emojilib][5]

## Support

<a href="https://paypal.me/p2kmgcl">
    <img alt="PayPal donations" src="https://img.shields.io/badge/donations-paypal-blue">
</a>

[1]: https://raw.githubusercontent.com/p2kmgcl/holi/master/assets/screenshot-main.jpg
[2]: https://chrome.google.com/webstore/detail/holi/jabgddbkjbekadednbljlbhhabiidndj
[3]: https://developer.chrome.com/extensions/devguide
[4]: https://codemirror.net/
[5]: https://github.com/muan/emojilib
[6]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons
[7]: https://raw.githubusercontent.com/p2kmgcl/holi/master/assets/chrome-badge.png
[8]: https://raw.githubusercontent.com/p2kmgcl/holi/master/assets/firefox-badge.png
