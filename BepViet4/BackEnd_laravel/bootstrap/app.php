<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
       
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.',
                    'code' => 401,
                    'action' => 'LOGIN_REQUIRED' 
                ], 401);
            }
        });
    })->create();
    