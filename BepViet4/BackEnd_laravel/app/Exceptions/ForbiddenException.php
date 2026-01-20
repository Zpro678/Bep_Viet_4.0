<?php

namespace App\Exceptions;

use Exception;

class ForbiddenException extends Exception
{
    protected $message = 'Bạn không có quyền thực hiện hành động này';
}
