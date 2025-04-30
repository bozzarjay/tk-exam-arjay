<?php

namespace App\Http\Controllers\API\Task;

use App\Http\Controllers\Controller;
use App\Models\TaskAttachments;
use App\Models\TaskManager;
use Auth;
use Illuminate\Http\Request;

class TaskManagerController extends Controller
{
    public function taskList(Request $request)
    {
        $userId = $request->user()->id;
        $status = $request->input('status', 'all');
        $limit = (int) $request->input('limit', 10);
        $start = (int) $request->input('offset', 0);
        $title = $request->input('title', null);

        $offset = $start * $limit;

        $query = TaskManager::with([
            'taskAttachment' => function ($query) {
                $query->select('*');
            }
        ])->where('user_id', $userId);

        if($title !== null || $title !== ""){
            $query->where('title', 'LIKE', "{$title}%");
        }

        switch ($status) {
            case 'done':
                $query->where('status', 1);
                break;
            case 'in_progress':
                $query->where('status', 2);
                break;
            case 'todo':
                $query->where('status', 0);
                break;
            default:
                break;
        }

        $count = $query->count();

        $query->limit($limit)->offset($offset);

        $tasks = $query->get();

        return response()->json(['data'=> $tasks, 'count'=>$count]);
    }

    public function addTask(Request $request)
    {

        $userId = $request->user()->id;

        $fileSizeValidation = $request->validate([
            'fileAttached' => 'file|mimes:jpg,jpeg,png,pdf|max:4096' // 4MB File
        ]);

        $task = TaskManager::create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'status' => 0,
            'is_published' => 0,
            'user_id' => $userId
        ]);

        if ($request->hasFile('fileAttached')) {
            if (!$fileSizeValidation)
                return response()->json(['fail' => 'File is invalid. Maximum file size is 4MB.'], 400);

            $file = $request->file('fileAttached');

            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $fileName);

            TaskAttachments::create([
                'task_id' => $task->id,
                'path' => 'uploads/' . $fileName,
            ]);

        }

        return response()->json(['message' => 'SUCCESS']);
    }

    public function updateStatusTask(Request $request)
    {

        $id = $request->input('id');
        $status = $request->input('status');

        $task = TaskManager::find($id);
        $task->status = $status;
        $task->save();

        return response()->json(['message' => 'SUCCESS']);
    }

    public function publishTask(Request $request)
    {
        $id = $request->input('id');
        $status = $request->input('status');

        $task = TaskManager::find($id);
        $task->is_published = $status;
        $task->save();

        return response()->json(['message' => 'SUCCESS']);
    }
}
