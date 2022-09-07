## Prerequisites
You will need the following things properly installed on your computer.

Browsers:
- Latest Chrome
- Latest Firefox
- Latest MS Edge
- Latest Safari (for Mac users)

Chrome Addons:
- [PixelPerfect](https://chrome.google.com/webstore/detail/perfectpixel-by-welldonec/dkaagdgjmgdmbnecmcefdhjekcoceebi?hl=en)
- [Color Picker](https://chrome.google.com/webstore/detail/colorpick-eyedropper/ohcpnigalekghcmgcdcenkpelffpdolg?hl=en)
- [Page ruler](https://chrome.google.com/webstore/detail/page-ruler-redux/giejhjebcalaheckengmchjekofhhmal?hl=en )

## Files structure
Unarchive and copy the content from `task` directory to `FileHub/web-client/static`.

## CSS includes order
1. Third party libs such as styles for custom fonts.
2. Your custom styles: `css\styles.css`.

## Working with styles
### Default styles
Some CSS styles recommended to set globally for all elements in the project. Those are:

body {
    margin: 0;
    color: value;
    font: value;
    background: value;
    min-width: value;
}

a {
    color: value;
    text-decoration: value;
}

a:hover {
    color: value;
    text-decoration: value;
}

input[type="text"] {
    color: value;
    font: value;
}

### CSS rules order
The expected order of CSS rules in a file is:
1. @font-face imports
2. Global default styles
3. Global styles for tags
4. Styles for reusable components such as:
    - .text-input
    - .button
    - .hr etc.
5. Styles for blocks according to their order in HTML: from top to bottom and from left to top. Example:
    - .header {}
    - .header .logo {}
    - .header .tools {}
    - .breadcrumb {}
    - .breadcrumb li {}
    - .footer {}
    - .social {}
    - .social li {}
