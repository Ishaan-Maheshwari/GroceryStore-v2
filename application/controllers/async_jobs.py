from flask import current_app as app, send_file, jsonify
from application.tasks import create_resource_csv
from celery.result import AsyncResult

@app.get('/download-txt')
def download_csv():
    try:
        task = create_resource_csv.delay()
        return jsonify({"task-id": task.id})
    except Exception as e:
        print(e)
        return jsonify({"message": "Error"}), 500


@app.get('/get-txt/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True,mimetype='text/csv',download_name='test.txt')
    else:
        return jsonify({"message": "Task Pending"}), 404
    