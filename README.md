Headset Toggle GNOME Extension
==============================

Simple GNOME shell extension to toggle the connection of a headset.
I developed it, because I change with my headset between my notebook and my smartphone a lot.

Current limitations:

* The MAC address needs to be replaced manually in the `extension.js` file.
* During command execution (connect / disconnect) the whole shell will freeze.
* It will take up to 60 seconds until an 'external' connection status change gets 'noticed'.
