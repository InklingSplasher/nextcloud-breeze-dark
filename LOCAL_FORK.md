# Local Nextcloud 33 and 34 port

This branch is an AGPL-3.0-or-later local fork of
`mwalbeck/nextcloud-breeze-dark`, based on upstream commit
`9ceda7d796bb142a466ecfc9c4887ea21c610038`.

The app keeps the `breezedark` app ID so existing user and administrator
preferences remain valid. An upstream App Store signature must not be copied
onto a modified build. Local builds are therefore intentionally unsigned unless
they are signed with a certificate controlled by the local operator.

Before production activation, test at least:

- login, logout, public shares, password reset and two-factor authentication;
- Files, Calendar, Contacts, Tasks, Deck, Photos and OnlyOffice views;
- personal enable/disable and automatic browser colour-scheme activation;
- global enforcement, login-page styling and custom CSS saving;
- desktop and mobile layouts in current Firefox, Chromium and Safari/WebKit;
- `occ integrity:check-core`, `occ setupchecks` and the Nextcloud log.

The Nextcloud 33/34 port kept the Breeze Dark design and selector set. The
InkCurity Dark redesign builds on that port: the PHP integration is unchanged,
the stylesheets were rewritten around `css/variables/_tokens.scss`. The visual
regression matrix above applies to it as well.

Nextcloud 34 compatibility is declared after updating the development API to
OCP 34. Nextcloud 35 is declared because the theme runs on a 35 instance and its
stylesheets cover the 35 app menu; repeat the matrix there as well. Repeat the visual regression matrix after the core upgrade because core
and app markup may change independently of the PHP and JavaScript APIs.
