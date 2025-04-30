<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\TaskManager;

class TaskAttachments extends Model
{
    protected $table = "tk_user_task_attachments";
    protected $fillable = [
        'task_id',
        'path',
        'filesize',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(TaskManager::class, 'id', 'task_id');
    }
}
