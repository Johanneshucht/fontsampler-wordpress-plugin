# Fontsampler Wordpress Plugin
This plugin allows Wordpress users to embed interactive webfont previews in their websites.

## How does it work?
After installing and activating the plugin the Wordpress admin can create *Fontsamplers*. Each *Fontsampler* can be 
embedded in any Wordpress Page or Post with a simple shortcode like so:

> [fontsampler id=123]

In the place of the shortcode the plugin will render the appropriate interface for previewing and manipulating the 
font.

## Current status
The plugin is currently **nearing beta release**. Feel free to get involved by opening issues or feature requests here, or join 
[the discussion group](https://groups.google.com/forum/#!forum/fontsampler-wordpress-plugin-development) to hear more
about the progress and development schedule.
 
Once released, the plugin will be available for free to all Wordpress users.

Eventually, the plugin will be available via the Wordpress plugin directory for simple one-click install.

## Supporting development
You can support the development of the plugin via funding the [indiegogo campaign](https://www.indiegogo.com/projects/wordpress-plugin-for-letting-users-test-typefaces#/) or, later, donating to
the project to show your appreciation. Furthermore, beta testers are very welcome to try out first builds and give feedback.

**Pull requests are more than welcome** as well, but let me know in the issues list what you are working on.

### Planned features not implemented yet
See the [issues](https://github.com/kontur/fontsampler-wordpress-plugin/issues) for the latest up-to-date information:

### Installing preview version
**IMPORTANT DISCLAIMER: This is pre-release quality and might be instable.** 
For the time being, I recommend to test the plugin on backup or local Wordpress installations, not in your website's 
production environment. At the very least back up your database and `wp-content` folder before testing the plugin. You 
have been warned!

* Go to [the releases tab](https://github.com/kontur/fontsampler-wordpress-plugin/releases) and download the "zip" archive
of the latest release
* In your Wordpress installation in the folder `wp-content/plugins` extract the archive into a new folder named "fontsampler"
* Login to your Wordpress admin
* Go to Plugins and activate the plugin
* You can now access the plugin options in the sidebar under `¶ Fontsampler`

# License
This code is distributed under the GNU General Public License v3.0. 
[See license](LICENSE.txt)

[Read a simplified version of what this license means](http://choosealicense.com/licenses/gpl-3.0/#)

(c) 2016 Johannes Neumeier