<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\TaskAttachments;

class TaskManager extends Model
{
    protected $table = "tk_user_task_registry";
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'status',
        'is_published',
        'is_trash'
    ];

    public function taskAttachment(): HasOne
    {
        return $this->hasOne(TaskAttachments::class, 'task_id', 'id');
    }
}
