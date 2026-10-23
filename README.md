# InkCurity Dark for Nextcloud

<img src="img/inkcurity-logo.svg" alt="InkCurity" width="96" align="right">

_Ink. Privacy. Craft._ A dark theme for [Nextcloud](https://nextcloud.com) in deep ink blue: calm
like iOS, crafted like a private terminal, playful only where it counts. One splash of light
for everything you can press, mono type for meta, a blinking cursor at the login and a splash of
ink when you switch it on.

Built on the [Breeze Dark theme](https://github.com/mwalbeck/nextcloud-breeze-dark) by Magnus
Walbeck. The app keeps the `breezedark` app id, so existing preferences stay valid.

![Dashboard with the InkCurity Dark theme](screenshot-dashboard.jpg)

| Files                               | App menu                                      |
| ----------------------------------- | --------------------------------------------- |
| ![Files view](screenshot-files.jpg) | ![App grid as ink keys](screenshot-apps.jpg)  |
| **Login**                           | **Settings**                                  |
| ![Login page](screenshot-login.jpg) | ![Theme settings](screenshot-settings.jpg)    |

## The design language

The theme follows two design systems:

-   **InkCurity** sets the identity: deep sea-blue ink instead of black, one splash of light as
    the accent, hairlines, glows instead of drop shadows, keys instead of lozenges, Space Grotesk
    for titles, Geist for the interface, JetBrains Mono for meta, the blinking cursor, redaction
    bars and the ink splash.
-   **Trumpf** sets the structure and the manners: few surfaces, one filled button per view,
    tinted selection, quiet counters, grouped settings, two motion curves, feedback under 200 ms
    and signature moments used sparingly.

What that looks like in Nextcloud:

| Where          | What |
| -------------- | ---- |
| Palette        | Ink, outside in: `#040b18` page, `#091629` panel, `#0f1e35` raised, `#132541` menus. Text `#dce5f2` (14:1), secondary `#7f9cc2` (6.4:1). |
| Accent         | Splash Blue `#5cc8ff`, the light end of the Trumpf blue fire. Filled with ink text (10:1) for the one main action, as text and focus ring everywhere else. Magenta `#ff3d8e` only for unread. |
| Layout         | Header and navigation sit on the ink. The app is a panel in front of it with a hairline edge that catches the light from the upper left. The details sidebar is a second panel. |
| Type           | Geist for the interface, Space Grotesk for titles and the greeting, JetBrains Mono for sizes, dates, counters, column heads and captions. All three ship with the theme. |
| Navigation     | The Trumpf sidebar: tinted selection with a faint lit edge, glyphs that light up, mono captions, quiet mono counters, magenta for unread. |
| Controls       | Keys with 10 px corners: a splash key with a lamp-light glow on hover, ink keys with a hairline edge, plain keys, red outlines for destructive actions. Fields are wells with a 3:1 edge and a splash ring on focus. |
| Overlays       | Menus float on a hairline and a faint glow and pop in, dialogs rise onto a scrim that removes the page, toasts carry a status dot. |
| App menu       | One colour for every app: ink keys with the glyph in the light, the open app is the one lit key. |
| Dashboard      | Today's date as a mono tag above a large greeting in Space Grotesk. The first widget is the live card, the one lit block of the page: ink under a bloom of light with a fine grain. Drag the widget you need most into first place. |
| Login          | The mark glows under one lamp, the headline ends in a cursor that blinks a few times, the footer is a redacted line and a mono signature. |
| Theme settings | An ink hero card with the mark, mono version line and the main switch; grouped switches in the splash; a real preview; an ink splash when you switch the theme on. |
| Motion         | Pages fade in and rise 8 px, one scan of light runs along the panel edge when a page has loaded. Reduced motion (system or Nextcloud) turns all of it off. |

No third-party requests: the fonts and everything else come from your server. And there is an
easter egg for those who know the Konami code.

### The backdrop

The theme owns its backdrop. The body background image Nextcloud would show (the default shore
photo, a user's upload, a shipped wallpaper) is replaced by ink with one bloom of light in the
upper left and a fine grain. To bring a background image back, add this under **Custom styling**:

```css
[data-themes*="breezedark"] #body-user,
[data-themes*="breezedark"] #body-settings {
    background-image: var(--image-background) !important;
    background-size: cover !important;
}
[data-themes*="breezedark"] {
    --image-background: url("/apps/theming/img/background/kamil-porembinski-clouds.jpg") !important;
}
```

### Changing the accent

The tokens live in `css/variables/_tokens.scss`. The splash is `--ic-splash` with its hover,
pressed and text variants next to it; change them together, keep the text on the fill at 4.5:1 or
more, and run `npm run build`. For file-type icons that Nextcloud draws on the server, set the
primary colour under **Administration › Design** to `#5cc8ff` as well.

## Supported versions

This branch is a local compatibility fork for:

-   Nextcloud 33
-   Nextcloud 34
-   Nextcloud 35 (the new app menu with app icons and quick-create actions is covered)

It is based on upstream Breeze Dark 29.0.0. The PHP integration, settings requests and Nextcloud
colour variables were ported to Nextcloud 33 and 34. Run the visual regression matrix in
[LOCAL_FORK.md](LOCAL_FORK.md) before enabling the theme on a production instance after a
Nextcloud major upgrade.

## Version numbering

This project follows semantic versioning. The major version number also follows the Nextcloud
version the release is intended for.

## Installation

Clone this repo into your app folder as `breezedark`, build the stylesheets and enable the app in
the app menu:

```
git clone https://github.com/InklingSplasher/nextcloud-breeze-dark breezedark
cd breezedark
npm ci && npm run build
```

`make appstore` builds the stylesheets and packs an unsigned tarball.

## Usage

After you install the theme, you need to enable it. There are two options for this, a global and a
personal one.

### Global

With the global options you can enforce the use of the theme for all users as well as
unauthenticated visits. Please note that when the theme is enforced for all users it isn't
possible for them to disable the theme or choose a different theme.

There is also an option to let the theme be enabled / disabled based on the theming preferences
reported by browser. When the theme is deactivated using this method, Nextcloud will revert to
using the default light theme. This setting only sets the default for when the theme is globally
enforced and can be overridden by the user.

You can also choose whether the login page should be themed. Though this only has an effect if the
theme is enforced globally, or during the login phase of a user that has the theme enabled.

You can find the global options here:

```
Settings > Administration > Theming > InkCurity Dark
```

### Personal

The personal option allows each user to enable / disable the theme unless it's being enforced by
the global options. They can though choose whether the theme should follow the theming choice
reported by the browser. This option is also available when the theme is being enforced globally.
If the user hasn't set a preference they will follow the global default. You can find the personal
option here:

```
Settings > Personal > Appearance and accessibility > InkCurity Dark
```

### Custom styling

Under the Theming section in the admin settings you can add your own custom styling to the theme.
Only standard CSS can be used. This custom styling will be applied whenever the theme is enabled
and only affects the InkCurity Dark theme.

## Development

```
npm ci            # toolchain
npm run build     # css/server*.css and css/guest*.css from the SCSS sources
npm run watch     # rebuild on change
npm run prettier  # formatting check (also runs in CI)
npm run stylelint
```

The tokens live in `css/variables/_tokens.scss` and are included once on the theme root for
logged-in pages and once on `:root` for the guest pages. `css/base/_fonts.scss` declares the three
faces from `fonts/`, `css/server/_signature.scss` holds the backdrop, the scan, the page entry and
the type signatures, `css/server/_server.scss` the chrome, `css/server/_appmenu.scss` the app
keys, and `css/settings.css` the self-contained settings hub. `js/trumpf-ui.js` provides the toast
and the ink splash. Selectors target `@nextcloud/vue` 9 as used by Nextcloud 33 to 35, with the v8
class names kept for apps that still ship the old bundle.

## Credits

-   [Breeze Dark for Nextcloud](https://github.com/mwalbeck/nextcloud-breeze-dark) by Magnus Walbeck
    and contributors, which this theme extends. If you like the foundation, consider supporting the
    upstream author.
-   The Breeze Dark colour scheme by the KDE Project, which inspired the original theme.
-   [Geist](https://github.com/vercel/geist-font), [Space Grotesk](https://github.com/floriankarsten/space-grotesk)
    and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), shipped in `fonts/` under the
    SIL Open Font License 1.1 (see `fonts/OFL-*.txt`).
