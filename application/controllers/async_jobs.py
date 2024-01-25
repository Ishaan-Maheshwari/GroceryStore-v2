from flask import current_app as app, send_file, jsonify
from application.tasks import create_resource_csv
from celery.result import AsyncResult

@app.get('/download-rpt')
def download_csv():
    try:
        task = create_resource_csv.delay()
        return {"taskid": task.id, "status": "Success"},200
    except Exception as e:
        print(e)
        return jsonify({"status": "Error"}), 500


@app.get('/get-rpt/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True, download_name="report.csv"),200
    else:
        return {"message": "Task Pending"}, 404