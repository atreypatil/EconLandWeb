from flask import Flask, abort, redirect, render_template, send_from_directory, url_for
import os

server = Flask(__name__)


@server.route('/')
def index():
    return render_template('index.html')


@server.route('/app')
def pwa_app():
    return send_from_directory(os.path.join(server.root_path, 'p1'), 'index.html')


@server.route('/download')
def download():
    apk_path = os.path.join(server.root_path, 'p1', 'dwl', 'econland.apk')
    apk_available = os.path.isfile(apk_path) and os.path.getsize(apk_path) > 0
    return render_template('download.html', apk_available=apk_available)


@server.route('/download/apk')
def download_apk():
    apk_directory = os.path.join(server.root_path, 'p1', 'dwl')
    apk_path = os.path.join(apk_directory, 'econland.apk')
    if not os.path.isfile(apk_path) or os.path.getsize(apk_path) == 0:
        abort(404, description='A valid Android APK has not been added yet.')

    return send_from_directory(
        apk_directory,
        'econland.apk',
        as_attachment=True,
    )


@server.route('/dld')
def dld():
    return redirect(url_for('download'))


@server.route('/manifest.json')
def manifest():
    return send_from_directory(os.path.join(server.root_path, 'p1'), 'manifest.json', mimetype='application/manifest+json')


@server.route('/service-worker.js')
@server.route('/sw.js')
def service_worker():
    response = send_from_directory(os.path.join(server.root_path, 'static'), 'sw.js', mimetype='application/javascript')
    return response


@server.route('/icons/<path:filename>')
def icons(filename):
    return send_from_directory(os.path.join(server.root_path, 'p1', 'icons'), filename)


if __name__ == "__main__":
    server.run(host='127.0.0.1', port=5000, debug=False)