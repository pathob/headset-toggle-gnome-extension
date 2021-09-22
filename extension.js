// https://gjs-docs.gnome.org/
// https://gjs.guide/extensions/

const {St, Clutter} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

let headset = '60:AB:D2:84:07:25';
let panelButton, panelButtonIcon, timeout;

function isConnected() {
    var [ok, out, err, exit] = GLib.spawn_command_line_sync('bluetoothctl info ' + headset);
    var regex = /\tConnected: (\w*)\n/;
    var match = out.toString().match(regex);
    return match[1] === "yes";
}

function toggleHeadset() {
    if (isConnected()) {
        var [ok, out, err, exit] = GLib.spawn_command_line_sync('bluetoothctl disconnect ' + headset);
    } else {
        var [ok, out, err, exit] = GLib.spawn_command_line_sync('bluetoothctl connect ' + headset);
    }
    setButtonIcon();
}

function setButtonIcon() {
    if (isConnected()) {
        panelButtonIcon.set_style_class_name('connected');
    } else {
        panelButtonIcon.set_style_class_name('disconnected');
    }
    return true;
}

function init() {
    panelButton = new St.Bin({
        style_class: "panel-button",
        reactive: true,
        can_focus: true,
        track_hover: true
    });

    // https://archlinux.org/packages/extra/any/gnome-icon-theme-symbolic/files/

    panelButtonIcon = new St.Icon({
        icon_name: "audio-headset-symbolic",
        y_align: Clutter.ActorAlign.CENTER,
        style_class: 'system-status-icon',
    });

    panelButton.set_child(panelButtonIcon);
    panelButton.connect('button-press-event', toggleHeadset);
}

function enable() {
    setButtonIcon();
    Main.panel._rightBox.insert_child_at_index(panelButton, 1);
    timeout = Mainloop.timeout_add_seconds(60.0, setButtonIcon);
}

function disable() {
    Mainloop.source_remove(timeout);
    Main.panel._rightBox.remove_child(panelButton);
}
